function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function calculateCurrentStreak(entryDates: string[], today: Date = new Date()): number {
  const set = new Set(entryDates);
  let streak = 0;
  const cursor = new Date(today);
  cursor.setUTCHours(0, 0, 0, 0);
  while (set.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

describe("streak calculation", () => {
  const today = new Date("2024-06-15T12:00:00Z");

  it("single entry today gives streak of 1", () => {
    expect(calculateCurrentStreak(["2024-06-15"], today)).toBe(1);
  });

  it("three consecutive days ending today gives streak of 3", () => {
    expect(
      calculateCurrentStreak(["2024-06-13", "2024-06-14", "2024-06-15"], today),
    ).toBe(3);
  });

  it("a gap resets the current streak to 0 if today missing", () => {
    expect(
      calculateCurrentStreak(["2024-06-10", "2024-06-11", "2024-06-13"], today),
    ).toBe(0);
  });

  it("returns 0 when there are no entries", () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it("counts only consecutive days back from today", () => {
    expect(
      calculateCurrentStreak(
        ["2024-06-10", "2024-06-14", "2024-06-15"],
        today,
      ),
    ).toBe(2);
  });
});
