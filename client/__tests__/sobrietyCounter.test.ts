function daysBetween(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

describe("sobriety counter (days elapsed)", () => {
  it("returns 0 on the same day", () => {
    const start = new Date("2024-01-15T08:00:00Z");
    const end = new Date("2024-01-15T20:00:00Z");
    expect(daysBetween(start, end)).toBe(0);
  });

  it("returns 1 after exactly 24 hours", () => {
    const start = new Date("2024-01-15T08:00:00Z");
    const end = new Date("2024-01-16T08:00:00Z");
    expect(daysBetween(start, end)).toBe(1);
  });

  it("returns 365 after exactly 1 non-leap year", () => {
    const start = new Date("2023-01-01T00:00:00Z");
    const end = new Date("2024-01-01T00:00:00Z");
    expect(daysBetween(start, end)).toBe(365);
  });

  it("returns 366 after exactly 1 leap year (2024)", () => {
    const start = new Date("2024-01-01T00:00:00Z");
    const end = new Date("2025-01-01T00:00:00Z");
    expect(daysBetween(start, end)).toBe(366);
  });

  it("includes Feb 29 on a leap year span", () => {
    const start = new Date("2024-02-28T00:00:00Z");
    const end = new Date("2024-03-01T00:00:00Z");
    expect(daysBetween(start, end)).toBe(2);
  });

  it("returns 0 for end before start (clamped)", () => {
    const start = new Date("2024-01-15T00:00:00Z");
    const end = new Date("2024-01-10T00:00:00Z");
    expect(daysBetween(start, end)).toBe(0);
  });
});
