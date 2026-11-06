import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Bot, Wrench, Users, Clock, Database, Shield, Store, Send, Globe, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIText } from "@/components/workspace-command";

type Card = { icon: LucideIcon; title: string; text: string };
const icons = [Bot, Wrench, Users, Clock, Database, Shield, Store];

function MiniIllustration({ index }: { index: number }) {
  const Icon = icons[index] ?? Bot;
  return <div className={`knowledge-illustration illustration-${index}`} aria-hidden="true">
    <span className="illustration-core"><Icon /></span>
    {index === 0 && <div className="robot-lines"><i /><i /><i /></div>}
    {index === 1 && <div className="tool-orbits"><span><Send /></span><span><Globe /></span><span><Zap /></span></div>}
    {index === 2 && <div className="team-nodes">{["Mijoz", "Lead", "Taklif", "Shartnoma"].map((label, i) => <span key={label} style={{ "--sequence": i } as CSSProperties}>{label}</span>)}</div>}
    {index === 3 && <div className="clock-sweep" />}
    {index === 4 && <div className="memory-stack"><i /><i /><i /></div>}
    {index === 5 && <div className="lock-scan" />}
    {index === 6 && <><div className="store-tiles"><i /><i /><i /></div><span className="store-ribbon">Tez orada</span></>}
  </div>;
}

export function KnowledgeCarousel({ cards }: { cards: Card[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const target = useRef<number | null>(null);
  const paused = useRef(false);
  const dragging = useRef(false);
  const pointer = useRef(0);
  const holdUntil = useRef(0);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const choose = (index: number) => {
    holdUntil.current = performance.now() + 3500;
    const current = Math.round(-angle.current / (360 / cards.length));
    let delta = index - ((current % cards.length + cards.length) % cards.length);
    if (delta > cards.length / 2) delta -= cards.length;
    if (delta < -cards.length / 2) delta += cards.length;
    target.current = -(current + delta) * (360 / cards.length);
    setActive((index + cards.length) % cards.length);
  };
  useEffect(() => {
    const element = ring.current;
    const viewport = stage.current;
    if (!element || !viewport) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const children = Array.from(element.children) as HTMLElement[];
    let frame = 0, previous = 0, lastIndex = 0;
    const animate = (time: number) => {
      const delta = previous ? Math.min(time - previous, 48) : 0;
      previous = time;
      if (target.current !== null) {
        const distance = target.current - angle.current;
        angle.current += reduced.matches ? distance : distance * .13;
        if (Math.abs(distance) < .04) { angle.current = target.current; target.current = null; }
      } else if (!paused.current && !dragging.current && !reduced.matches && time > holdUntil.current) angle.current -= delta * 360 / 14000;
      element.style.transform = `translateZ(calc(-1 * var(--ring-radius))) rotateY(${angle.current}deg)`;
      children.forEach((child, i) => {
        const degrees = angle.current + i * 360 / cards.length;
        const front = (Math.cos(degrees * Math.PI / 180) + 1) / 2;
        child.style.opacity = `${.55 + .45 * front}`;
        child.style.transform = `rotateY(${i * 360 / cards.length}deg) translateZ(var(--ring-radius)) scale(${.75 + front * .25})`;
        child.setAttribute("aria-hidden", front < .9 ? "true" : "false");
      });
      const index = ((Math.round(-angle.current / (360 / cards.length)) % cards.length) + cards.length) % cards.length;
      if (index !== lastIndex) { lastIndex = index; setActive(index); }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [cards]);
  return <>
    <div ref={stage} className="info-carousel" tabIndex={0} role="region" aria-label="Agentus haqida kartalar"
      onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { if (!focused) paused.current = false; }}
      onFocus={() => { setFocused(true); paused.current = true; }} onBlur={() => { setFocused(false); paused.current = false; }}
      onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); choose(active + (event.key === "ArrowRight" ? 1 : -1)); } }}
      onPointerDown={(event) => { dragging.current = true; target.current = null; pointer.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerMove={(event) => { if (!dragging.current) return; angle.current += (event.clientX - pointer.current) * .25; pointer.current = event.clientX; }}
      onPointerUp={(event) => { dragging.current = false; event.currentTarget.releasePointerCapture(event.pointerId); target.current = Math.round(angle.current / (360 / cards.length)) * (360 / cards.length); }}
      onPointerCancel={() => { dragging.current = false; }}>
      <div className="knowledge-ring" ref={ring}>
        {cards.map((card, index) => <article key={card.title} className={`info-card knowledge-accent-${index}`}>
          <MiniIllustration index={index} /><h3><AIText text={card.title} /></h3><p><AIText text={card.text} /></p><span className="info-card-number">0{index + 1}</span>
        </article>)}
      </div>
    </div>
    <div className="carousel-controls">
      <Button variant="workspace" size="workspace" className="icon-button" aria-label="Oldingi karta" onClick={() => choose(active - 1)}><ArrowLeft /></Button>
      <div className="carousel-dots">{cards.map((card, index) => <Button variant="workspace" size="workspace" key={card.title} className={active === index ? "active" : ""} aria-label={`${index + 1}-karta`} aria-current={active === index ? "true" : undefined} onClick={() => choose(index)}><span className="dot-fill" /></Button>)}</div>
      <Button variant="workspace" size="workspace" className="icon-button" aria-label="Keyingi karta" onClick={() => choose(active + 1)}><ArrowRight /></Button>
    </div>
  </>;
}