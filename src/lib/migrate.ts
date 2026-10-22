import { defaults, type PlanInput } from "./plan";
const directions = {
  fitness: "body",
  nutrition: "nutrition",
  work: "system",
  focus: "mind",
} as const;
const goals = {
  fitness: [0, 1, 2],
  nutrition: [0, 1, 3],
  work: [3, 1, 2],
  focus: [3, 0, 2],
};
const barriers = {
  fitness: [1, 0, 2],
  nutrition: [1, 0, 3],
  work: [2, 3, 1],
  focus: [1, 3, 2],
};
export function migrateLegacy(value: unknown): PlanInput | null {
  if (!value || typeof value !== "object") return null;
  const old = value as Record<string, unknown>;
  if (
    typeof old.direction !== "string" ||
    !Object.hasOwn(directions, old.direction)
  )
    return null;
  const key = old.direction as keyof typeof directions;
  if (
    ![old.goal, old.barrier, old.time].every(
      (n) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < 3,
    )
  )
    return null;
  return {
    ...defaults,
    direction: directions[key],
    goal: goals[key][Number(old.goal)],
    barrier: barriers[key][Number(old.barrier)],
    minutes: [10, 25, 45][Number(old.time)],
  };
}
