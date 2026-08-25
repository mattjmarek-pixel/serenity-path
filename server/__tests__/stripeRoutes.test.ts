import { z } from "zod";

const createCheckoutSessionSchema = z.object({
  priceId: z.string().min(1, "priceId is required").max(255),
});

describe("stripe create-checkout-session validation", () => {
  it("rejects missing priceId with 400-equivalent failure", () => {
    const result = createCheckoutSessionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects priceId of wrong type", () => {
    const result = createCheckoutSessionSchema.safeParse({ priceId: 123 });
    expect(result.success).toBe(false);
  });

  it("rejects empty-string priceId", () => {
    const result = createCheckoutSessionSchema.safeParse({ priceId: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid priceId", () => {
    const result = createCheckoutSessionSchema.safeParse({
      priceId: "price_123ABC",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceId).toBe("price_123ABC");
    }
  });
});
