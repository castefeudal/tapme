import { describe, it, expect } from "vitest";
import { resource, recommendation, keys } from "./logic";
describe("resource", () => {
  it("computes weekly and total realistic time separately from ideal", () => {
    expect(resource(25, 3, 8, 80)).toEqual({
      weekly: 1,
      total: 8,
      sessions: 24,
      ideal: 10,
      gap: 2,
    });
  });
  it("handles bounds", () => {
    expect(resource(10, 1, 4, 50).total).toBeCloseTo(1 / 3);
    expect(resource(180, 7, 12, 100).total).toBe(252);
  });
  it.each([
    [9, 1, 4, 50],
    [181, 1, 4, 50],
    [10, 0, 4, 50],
    [10, 8, 4, 50],
    [10, 1, 5, 50],
    [10, 1, 4, 49],
    [NaN, 1, 4, 50],
    [10, 1.5, 4, 50],
  ])("rejects invalid parameters", (...args) =>
    expect(() =>
      resource(...(args as [number, number, number, number])),
    ).toThrow(),
  );
});
describe("routes", () => {
  for (const direction of keys)
    for (const lang of ["ru", "en"] as const)
      it(`${direction} ${lang}: all answers affect advice`, () => {
        const a = { direction, goal: 0, barrier: 0, time: 0 };
        const r = recommendation(a, lang);
        expect(r.steps).toHaveLength(3);
        expect(r.product).toBe(
          direction === "fitness" ? 1 : direction === "work" ? 2 : 0,
        );
        for (const field of ["goal", "barrier", "time"] as const) {
          expect(recommendation({ ...a, [field]: 1 }, lang)).not.toEqual(r);
        }
        for (let goal = 0; goal < 3; goal++)
          for (let barrier = 0; barrier < 3; barrier++)
            for (let time = 0; time < 3; time++) {
              const v = recommendation(
                { direction, goal, barrier, time },
                lang,
              );
              expect(v.steps.every(Boolean)).toBe(true);
              expect(v.why).toBeTruthy();
            }
      });
});
