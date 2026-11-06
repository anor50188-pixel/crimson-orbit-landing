import { describe, it } from "node:test";
import { deepStrictEqual, ok } from "node:assert/strict";
import { plannedPlans, roadmapStages } from "./landing-content";

describe("uploaded proposed tariffs", () => {
  it("keeps Freemium limits", () => { deepStrictEqual(plannedPlans[0], { name: "Freemium", price: 0, agents: 2, tools: 2, requests: 500, scheduled: false }); });
  it("keeps Pro price and limits", () => { deepStrictEqual(plannedPlans[1], { name: "Pro", price: 19, agents: 10, tools: 5, requests: 5000, scheduled: true }); });
  it("keeps Pro Max price and limits", () => { deepStrictEqual(plannedPlans[2], { name: "Pro Max", price: 49, agents: null, tools: null, requests: 25000, scheduled: true }); });
  it("keeps proposed commission", () => { ok(roadmapStages[1].items.includes("Agent sotish va 25% komissiya")); });
});