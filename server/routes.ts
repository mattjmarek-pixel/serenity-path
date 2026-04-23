import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { sql } from "drizzle-orm";
import path from "node:path";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

type MeetingModality = "In-Person" | "Online" | "Hybrid";

interface NormalizedMeeting {
  name: string;
  formatted_address: string;
  day: number | null;
  time: string;
  types: string[];
  modality: MeetingModality;
  distance: number | null;
  url: string;
  lat: number | null;
  lng: number | null;
}

interface PlacesPlace {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
}

interface PlacesResponse {
  places?: PlacesPlace[];
  error?: { code?: number; message?: string; status?: string };
}

function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function fetchMeetingsFromPlaces(
  lat: number,
  lng: number,
  distance: number
): Promise<NormalizedMeeting[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  const radiusMeters = Math.min(distance * 1609.34, 50000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const resp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery: "Alcoholics Anonymous meeting",
        locationBias: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radiusMeters,
          },
        },
        maxResultCount: 20,
      }),
    });
    clearTimeout(timer);

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      throw new Error(`Places API HTTP ${resp.status}: ${body.slice(0, 200)}`);
    }

    const data = (await resp.json()) as PlacesResponse;
    if (data.error) {
      throw new Error(`Places API error: ${data.error.message ?? data.error.status}`);
    }

    const places = Array.isArray(data.places) ? data.places : [];

    const normalized: NormalizedMeeting[] = places
      .map((p): NormalizedMeeting | null => {
        const name = p.displayName?.text?.trim();
        const formatted_address = p.formattedAddress?.trim() ?? "";
        const placeLat =
          typeof p.location?.latitude === "number" ? p.location.latitude : null;
        const placeLng =
          typeof p.location?.longitude === "number" ? p.location.longitude : null;
        if (!name || !formatted_address) return null;

        const dist =
          placeLat !== null && placeLng !== null
            ? haversineMiles(lat, lng, placeLat, placeLng)
            : null;

        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${name}, ${formatted_address}`
        )}${p.id ? `&query_place_id=${p.id}` : ""}`;

        return {
          name,
          formatted_address,
          day: null,
          time: "",
          types: [],
          modality: "In-Person",
          distance: dist !== null ? Math.round(dist * 10) / 10 : null,
          url,
          lat: placeLat,
          lng: placeLng,
        };
      })
      .filter((m): m is NormalizedMeeting => m !== null)
      .sort((a, b) => {
        if (a.distance === null && b.distance === null) return 0;
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });

    return normalized;
  } catch (err: unknown) {
    clearTimeout(timer);
    throw err;
  }
}

function getBaseUrl(): string {
  return process.env.APP_URL || `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/meetings', async (req, res) => {
    const lat = parseFloat(String(req.query.lat ?? ""));
    const lng = parseFloat(String(req.query.lng ?? ""));
    const rawDistance = parseFloat(String(req.query.distance ?? "25")) || 25;
    const distance = Math.min(Math.max(rawDistance, 1), 100);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'lat and lng are required numeric query parameters' });
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'lat must be -90..90 and lng must be -180..180' });
    }

    try {
      const meetings = await fetchMeetingsFromPlaces(lat, lng, distance);
      res.json({ meetings, count: meetings.length });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[meetings] Places fetch failed:', msg);
      res.status(503).json({ error: 'Meeting directory temporarily unavailable', meetings: [] });
    }
  });

  app.get('/privacy', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'server/pages/privacy-policy.html'));
  });

  app.get('/terms', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'server/pages/terms-of-service.html'));
  });
  app.get('/api/stripe/publishable-key', async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error: unknown) {
      console.error('Error getting publishable key:', error);
      res.status(500).json({ error: 'Failed to get Stripe configuration' });
    }
  });

  app.get('/api/stripe/prices', async (req, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      
      const products = await stripe.products.search({ 
        query: "name:'Serenity Path Supporter'" 
      });

      if (products.data.length === 0) {
        return res.json({ prices: [] });
      }

      const product = products.data[0];
      const prices = await stripe.prices.list({ 
        product: product.id, 
        active: true 
      });

      const formattedPrices = prices.data.map(price => ({
        id: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        productId: product.id,
        productName: product.name,
      }));

      res.json({ prices: formattedPrices });
    } catch (error: unknown) {
      console.error('Error fetching prices:', error);
      res.status(500).json({ error: 'Failed to fetch prices' });
    }
  });

  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      const stripe = await getUncachableStripeClient();
      
      const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
      const product = price.product as { name?: string; metadata?: Record<string, string> };
      
      if (!product || product.name !== 'Serenity Path Supporter') {
        return res.status(400).json({ error: 'Invalid price selected' });
      }

      if (!price.active) {
        return res.status(400).json({ error: 'Price is no longer available' });
      }
      
      const baseUrl = getBaseUrl();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout/cancel`,
        allow_promotion_codes: true,
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  app.post('/api/stripe/create-portal-session', async (req, res) => {
    try {
      const { customerId } = req.body;

      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }

      const stripe = await getUncachableStripeClient();
      const baseUrl = getBaseUrl();

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: baseUrl,
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      console.error('Error creating portal session:', error);
      res.status(500).json({ error: 'Failed to create portal session' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
