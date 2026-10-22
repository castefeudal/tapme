import { describe, it, expect } from "vitest";
import {
  resource,
  defaults,
  buildPlan,
  validInput,
  validDate,
  planText,
} from "./plan";
import { routeKeys } from "../config/routes";
import { calendar, escapeICS, foldICS } from "./exports";
describe("resource", () => {
  it("keeps ideal and realistic capacity separate", () =>
    expect(resource(25, 3, 8, 80)).toEqual({
      weekly: 1,
      total: 8,
      sessions: 24,
      ideal: 10,
      gap: 2,
    }));
  it("supports all bounds", () => {
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
  ])("rejects invalid inputs", (...args) =>
    expect(() =>
      resource(...(args as [number, number, number, number])),
    ).toThrow(),
  );
});
describe("transparent recommendations", () => {
  for (const direction of routeKeys)
    for (const lang of ["ru", "en"] as const)
      it(`${direction}/${lang}: every goal and constraint has meaningful content`, () => {
        const all = new Set<string>();
        for (let goal = 0; goal < 4; goal++)
          for (let barrier = 0; barrier < 4; barrier++)
            for (const minutes of [10, 25, 180])
              for (const days of [1, 3, 7]) {
                const input = {
                  ...defaults,
                  direction,
                  goal,
                  barrier,
                  minutes,
                  days,
                };
                const p = buildPlan(input, lang);
                expect(p.sessions).toHaveLength(days);
                expect(new Set(p.sessions.map((s) => s.date)).size).toBe(days);
                expect(p.sessions[0].date).toBe(input.start);
                expect(p.today.length).toBeGreaterThan(20);
                expect(p.obstacle.length).toBeGreaterThan(20);
                expect(p.product).toBe(
                  direction === "body" ? 1 : direction === "system" ? 2 : 0,
                );
                expect(planText(p, input, lang)).toContain(p.metric);
                all.add(p.goal + "|" + p.obstacle);
              }
        expect(all.size).toBe(16);
      });
  it("short budgets change the first action and optional facts are preserved", () => {
    const base = buildPlan(defaults, "ru");
    expect(buildPlan({ ...defaults, minutes: 10 }, "ru").today).not.toBe(
      base.today,
    );
    const input = {
      ...defaults,
      direction: "system" as const,
      target: "Мой результат",
      owner: "Мария",
    };
    expect(buildPlan(input, "ru").title).toBe("Мой результат");
    expect(buildPlan(input, "ru").owner).toBe("Мария");
    expect(
      buildPlan({ ...defaults, direction: "mind", cue: "После завтрака" }, "ru")
        .cue,
    ).toBe("После завтрака");
  });
  it("rejects corrupt stored plans and invalid dates", () => {
    expect(validInput({ ...defaults, goal: 5 })).toBe(false);
    expect(validInput({ ...defaults, days: "3" })).toBe(false);
    expect(validInput({ ...defaults, target: "x".repeat(161) })).toBe(false);
    expect(validInput({ ...defaults, time: "25:00" })).toBe(false);
    expect(validDate("2026-02-30")).toBe(false);
    expect(validDate("2028-02-29")).toBe(true);
    expect(validInput(defaults)).toBe(true);
  });
});
describe("calendar", () => {
  it("has the correct recurring sessions, local dates and durations over midnight", () => {
    const a = {
      ...defaults,
      start: "2026-12-30",
      time: "23:45",
      minutes: 30,
      days: 3,
      weeks: 4,
    };
    const p = buildPlan(a, "ru");
    const text = calendar(p, a, "ru", new Date("2026-01-01T00:00:00Z"));
    expect(text.match(/BEGIN:VEVENT/g)).toHaveLength(4);
    expect(text.match(/COUNT=4/g)).toHaveLength(3);
    expect(text).toContain("DTSTART:20261230T234500");
    expect(text).toContain("DTEND:20261231T001500");
    expect(text).toContain("DTSTART;VALUE=DATE:20270105");
    expect(text).toContain("DTSTAMP:20260101T000000Z");
    expect(text).not.toContain("\nBEGIN:VEVENT\n");
  });
  it("escapes calendar syntax and folds UTF-8 without splitting characters", () => {
    expect(escapeICS("a,b;c\nx\\y")).toBe("a\\,b\\;c\\nx\\\\y");
    const original = "DESCRIPTION:" + "Действие ".repeat(100);
    const folded = foldICS(original);
    expect(
      folded
        .split("\r\n")
        .every((l) => new TextEncoder().encode(l).length <= 75),
    ).toBe(true);
    expect(folded.replace(/\r\n /g, "")).toBe(original);
  });
});
import { migrateLegacy } from "./migrate";
import { wrapLines } from "./exports";
it("legacy goal meanings and constraints survive the new taxonomy", () => {
  expect(
    migrateLegacy({ direction: "nutrition", goal: 2, barrier: 1, time: 2 }),
  ).toMatchObject({ direction: "nutrition", goal: 3, barrier: 0, minutes: 45 });
  expect(
    migrateLegacy({ direction: "focus", goal: 0, barrier: 0, time: 0 }),
  ).toMatchObject({ direction: "mind", goal: 3, barrier: 1 });
  expect(
    migrateLegacy({ direction: "work", goal: 8, barrier: 0, time: 0 }),
  ).toBe(null);
});
it("PNG wrapping preserves long unbroken goals without clipping", () => {
  const text = "Long word " + "Цель".repeat(40);
  const lines = wrapLines(text, 20, (s) => s.length);
  expect(lines.every((line) => line.length <= 20)).toBe(true);
  expect(lines.join("").replace(/ /g, "")).toBe(text.replace(/ /g, ""));
});
