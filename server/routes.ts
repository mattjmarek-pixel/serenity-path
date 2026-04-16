import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { sql } from "drizzle-orm";
import path from "node:path";
import { getUncachableStripeClient, getStripePublishableKey } from "./stripeClient";

interface TSMLMeeting {
  name?: string;
  day?: number | string;
  time?: string;
  types?: string[];
  type?: string[];
  address?: string;
  formatted_address?: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number | string;
  lng?: number | string;
  distance?: number | string;
  url?: string;
  slug?: string;
  timezone?: string;
  location?: string;
  location_url?: string;
  notes?: string;
}

interface NormalizedMeeting {
  name: string;
  formatted_address: string;
  day: number;
  time: string;
  types: string[];
  distance: number | null;
  url: string;
  lat: number | null;
  lng: number | null;
}

function normalizeTSML(raw: TSMLMeeting): NormalizedMeeting | null {
  const name = raw.name?.trim();
  if (!name) return null;
  const day = parseInt(String(raw.day ?? "0"), 10);
  if (isNaN(day) || day < 0 || day > 6) return null;
  const time = String(raw.time ?? "").replace(/^(\d{1,2}):(\d{2}).*$/, "$1:$2");
  if (!time) return null;

  const addrParts: string[] = [];
  if (raw.address) addrParts.push(raw.address.trim());
  if (raw.city) addrParts.push(raw.city.trim());
  if (raw.state) addrParts.push(raw.state.trim());
  const formatted_address = raw.formatted_address?.trim() || addrParts.join(", ");

  const types = Array.isArray(raw.types)
    ? raw.types
    : Array.isArray(raw.type)
    ? raw.type
    : [];

  const distRaw = raw.distance;
  const distance =
    distRaw !== undefined && distRaw !== null ? parseFloat(String(distRaw)) || null : null;

  const lat = raw.lat !== undefined ? parseFloat(String(raw.lat)) || null : null;
  const lng = raw.lng !== undefined ? parseFloat(String(raw.lng)) || null : null;

  const url =
    raw.url?.trim() ||
    raw.location_url?.trim() ||
    (raw.slug ? `https://www.aa.org/meetings/${raw.slug}` : "");

  return { name, formatted_address, day, time, types, distance, url, lat, lng };
}

const REGIONAL_TSML_SOURCES: Array<{
  url: (lat: number, lng: number, dist: number) => string;
  label: string;
}> = [
  {
    label: "Meeting Guide REST",
    url: (lat, lng, dist) =>
      `https://www.aa.org/find-aa/meetings/?format=json&lat=${lat}&lng=${lng}&distance=${dist}`,
  },
  {
    label: "Meeting Guide API",
    url: (lat, lng, dist) =>
      `https://api.meetingguide.org/meetings.json?lat=${lat}&lng=${lng}&distance=${dist}`,
  },
];

async function fetchMeetings(
  lat: number,
  lng: number,
  distance: number
): Promise<NormalizedMeeting[]> {
  let atLeastOneSourceSucceeded = false;

  for (const source of REGIONAL_TSML_SOURCES) {
    try {
      const url = source.url(lat, lng, distance);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json", "User-Agent": "SerenityPath/1.0" },
      });
      clearTimeout(timer);

      if (!resp.ok) {
        console.warn(`[meetings] ${source.label} returned HTTP ${resp.status}`);
        continue;
      }

      const ct = resp.headers.get("content-type") ?? "";
      if (!ct.includes("application/json")) {
        console.warn(`[meetings] ${source.label} returned non-JSON content-type: ${ct}`);
        continue;
      }

      const raw = await resp.json();
      const list: TSMLMeeting[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.meetings)
        ? raw.meetings
        : [];

      atLeastOneSourceSucceeded = true;

      if (list.length === 0) continue;
      const normalized = list
        .map(normalizeTSML)
        .filter((m): m is NormalizedMeeting => m !== null)
        .slice(0, 40);
      if (normalized.length > 0) return normalized;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[meetings] ${source.label} error: ${msg}`);
      continue;
    }
  }

  if (!atLeastOneSourceSucceeded) {
    throw new Error("All meeting directory sources are currently unavailable");
  }

  return [];
}

function getBaseUrl(): string {
  return process.env.APP_URL || `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/api/meetings', async (req, res) => {
    const lat = parseFloat(String(req.query.lat ?? ""));
    const lng = parseFloat(String(req.query.lng ?? ""));
    const distance = parseFloat(String(req.query.distance ?? "25")) || 25;

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'lat and lng are required numeric query parameters' });
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'lat must be -90..90 and lng must be -180..180' });
    }

    try {
      const meetings = await fetchMeetings(lat, lng, distance);
      res.json({ meetings, count: meetings.length });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[meetings] Directory fetch failed:', msg);
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
