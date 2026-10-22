import { describe, it, expect } from "vitest";
import { vcard } from "./card";
import { activeSocial, socials } from "../config/socials";
import { shortActions } from "../config/short-actions";
import { buildPlan, defaults } from "./plan";
describe("digital contact card", () => {
  it("does not infer a telephone number from WhatsApp", () => {
    expect(vcard()).not.toContain("TEL");
    expect(vcard()).not.toContain("375255223132");
    expect(vcard("+375 25 1234567")).toContain("TEL;TYPE=CELL:+375 25 1234567");
  });
  it("exports complete interoperable vCard records", () => {
    expect(vcard()).toMatch(/^BEGIN:VCARD\r\nVERSION:3.0/);
    expect(vcard()).toMatch(/END:VCARD\r\n$/);
  });
  it("publishes only configured secure links", () => {
    expect(socials).toHaveLength(12);
    expect(socials.filter((s) => activeSocial(s.url))).toHaveLength(4);
    expect(activeSocial("javascript:alert(1)")).toBe(false);
    expect(activeSocial("")).toBe(false);
  });
  it("keeps every short session within a ten-minute recipe", () => {
    for (const direction of ["body", "nutrition", "mind", "system"] as const)
      for (let goal = 0; goal < 4; goal++) {
        const plan = buildPlan(
          { ...defaults, direction, goal, minutes: 10 },
          "ru",
        );
        expect(plan.today).toBe(shortActions[direction][goal][0]);
        expect(plan.practice).toBe(plan.today);
        expect(
          plan.sessions.every(
            (s) => s.action === plan.today && s.minutes === 10,
          ),
        ).toBe(true);
        const minutes = [...plan.today.matchAll(/(\d+) минут/g)].reduce(
          (n, m) => n + Number(m[1]),
          0,
        );
        expect(minutes).toBe(10);
      }
  });
});
