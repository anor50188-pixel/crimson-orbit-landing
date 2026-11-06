import { useEffect, useRef } from "react";
const cosmos = "/images/workspace-cosmos.webp";
const crimsonPlanet = "/images/workspace-crimson-planet.webp";
const ringedPlanet = "/images/workspace-ringed-planet.webp";

/** Static bitmap/canvas layers; only their transforms and opacity animate. */
export function WorkspaceCosmos({ continuous = false }: { continuous?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = root.current;
    const surface = canvas.current;
    if (!node || !surface) return;
    const context = surface.getContext("2d");
    if (!context) return;
    const foreground = getComputedStyle(node).getPropertyValue("--foreground").trim();
    surface.width = 1400;
    surface.height = 1000;
    context.fillStyle = foreground;
    for (let i = 0; i < 190; i++) {
      context.globalAlpha = .2 + (i % 7) / 10;
      context.beginPath();
      context.arc((i * 193 + 41) % 1400, (i * 347 + 89) % 1000, i % 9 === 0 ? 1.5 : .7, 0, Math.PI * 2);
      context.fill();
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetX = 0, targetY = 0, x = 0, y = 0, frame = 0;
    const move = (event: PointerEvent) => {
      const box = node.getBoundingClientRect();
      targetX = ((event.clientX - box.left) / box.width - .5) * 18;
      targetY = ((event.clientY - box.top) / box.height - .5) * 12;
    };
    const leave = () => { targetX = 0; targetY = 0; };
    const animate = () => {
      if (reduced.matches) {
        x = 0; y = 0;
      } else {
        x += (targetX - x) * .055;
        y += (targetY - y) * .055;
      }
      node.style.setProperty("--space-x", `${x}px`);
      node.style.setProperty("--space-y", `${y}px`);
      frame = requestAnimationFrame(animate);
    };
    const parent = node.parentElement;
    parent?.addEventListener("pointermove", move);
    parent?.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      parent?.removeEventListener("pointermove", move);
      parent?.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <div ref={root} className={`workspace-cosmos ${continuous ? 'continuous-cosmos' : ''}`} aria-hidden="true">
      <img className="cosmos-art" src={cosmos} width={1920} height={1088} alt="" draggable={false} />
      <img className="cosmos-crimson-planet" src={crimsonPlanet} alt="" draggable={false} />
      <img className="cosmos-ringed-planet" src={ringedPlanet} alt="" draggable={false} />
      <canvas ref={canvas} className="cosmos-stars" />
      <div className="cosmos-stars cosmos-stars-secondary" />
      <div className="cosmos-smoke" />
      <div className="cosmos-meteor meteor-one" /><div className="cosmos-meteor meteor-two" /><div className="cosmos-meteor meteor-three" />
      <div className="cosmos-scrim" />
    </div>
  );
}