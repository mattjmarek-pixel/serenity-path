import { getUncachableStripeClient } from "./stripeClient";

async function createSupporterProducts() {
  const stripe = await getUncachableStripeClient();

  console.log("Checking for existing Serenity Path Supporter product...");

  const existingProducts = await stripe.products.search({
    query: "name:'Serenity Path Supporter'",
  });

  if (existingProducts.data.length > 0) {
    console.log("Serenity Path Supporter product already exists");
    const product = existingProducts.data[0];
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });
    console.log("Existing product:", product.id);
    console.log(
      "Existing prices:",
      prices.data.map((p) => ({
        id: p.id,
        amount: p.unit_amount,
        interval: p.recurring?.interval,
      })),
    );
    return;
  }

  console.log("Creating Serenity Path Supporter product...");

  const product = await stripe.products.create({
    name: "Serenity Path Supporter",
    description:
      "Support the Serenity Path app development with a recurring contribution. Receive a supporter badge on your profile.",
    metadata: {
      app: "serenity-path",
      type: "supporter",
    },
  });

  console.log("Created product:", product.id);

  const monthlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 199,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: {
      tier: "monthly",
    },
  });

  console.log("Created monthly price:", monthlyPrice.id, "($1.99/month)");

  const yearlyPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 1999,
    currency: "usd",
    recurring: { interval: "year" },
    metadata: {
      tier: "yearly",
    },
  });

  console.log("Created yearly price:", yearlyPrice.id, "($19.99/year)");

  console.log("\nProducts created successfully!");
  console.log("Monthly Price ID:", monthlyPrice.id);
  console.log("Yearly Price ID:", yearlyPrice.id);
}

createSupporterProducts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error creating products:", err);
    process.exit(1);
  });
