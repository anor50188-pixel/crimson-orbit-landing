import { describe, expect, it } from "bun:test";
import { plannedPlans, roadmapStages } from "./landing-content";

describe("uploaded proposed tariffs", () => {
  it("keeps Freemium limits", () => { expect(plannedPlans[0]).toEqual({ name: "Freemium", price: 0, agents: 2, tools: 2, requests: 500, scheduled: false }); });
  it("keeps Pro price and limits", () => { expect(plannedPlans[1]).toEqual({ name: "Pro", price: 19, agents: 10, tools: 5, requests: 5000, scheduled: true }); });
  it("keeps Pro Max price and limits", () => { expect(plannedPlans[2]).toEqual({ name: "Pro Max", price: 49, agents: null, tools: null, requests: 25000, scheduled: true }); });
  it("keeps proposed commission", () => { expect(roadmapStages[1].items).toContain("Agent sotish va 25% komissiya"); });
});