import { describe, expect, it } from "vitest";

function calculateNoShowRate(total: number, noShows: number) {
  if (total <= 0) return 0;
  return Math.round((noShows / total) * 100);
}

describe("calculateNoShowRate", () => {
  it("returns zero when there are no appointments", () => {
    expect(calculateNoShowRate(0, 0)).toBe(0);
  });

  it("returns a rounded percentage", () => {
    expect(calculateNoShowRate(30, 4)).toBe(13);
  });
});
