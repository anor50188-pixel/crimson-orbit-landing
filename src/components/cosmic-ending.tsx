import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUp, X } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';
import { useI18n } from '@/i18n';

export function CosmicEnding({ onCreate }: { onCreate?: () => void }) {
  const { t } = useI18n();
  const [notice, setNotice] = useState<string | null>(null);
  return <div className="cosmic-ending">
    <section className="cosmic-closing"><img src="/images/workspace-cosmos.webp" alt="" loading="lazy"/><div className="closing-copy"><h2>{t('app.shared.closing_title')}</h2>{onCreate ? <Button variant="neon" onClick={onCreate}>{t('app.shared.closing_action')}<ArrowRight/></Button> : <Button asChild variant="neon"><Link to="/agent-yaratish">{t('app.shared.closing_action')}<ArrowRight/></Link></Button>}</div></section>
    <footer className="cosmic-footer"><Link to="/agent-yaratish" className="ending-wordmark">AGENTUS<span>.</span></Link><nav>{(['help','privacy','terms'] as const).map(key => <Button key={key} variant="ghost" onClick={() => setNotice(t(`app.shared.${key}`))}>{t(`app.shared.${key}`)}</Button>)}</nav><LanguageSwitcher/><p>{t('app.shared.copyright', { year: new Date().getFullYear() })}</p></footer>
    {notice && <div className="cosmic-notice" role="dialog" aria-modal="true" aria-label={notice} onKeyDown={event => { if (event.key === 'Escape') setNotice(null); }}><h3>{notice}</h3><p>{t('app.shared.not_available')}</p><Button autoFocus variant="ghost" onClick={() => setNotice(null)} aria-label={t('app.shared.close')}><X/></Button></div>}
  </div>;
}

export function ScrollAtmosphere() {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = (event?: Event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const container = event?.target instanceof HTMLElement && event.target.scrollHeight > event.target.clientHeight ? event.target : document.documentElement;
        const scroll = container.scrollTop;
        const total = container.scrollHeight - container.clientHeight;
        root.current?.style.setProperty('--scroll-progress', `${total > 0 ? scroll / total : 0}`);
        document.documentElement.style.setProperty('--cosmic-scroll', `${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : Math.min(scroll, 4000)}px`);
        setShow(scroll > 600);
      });
    };
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('cosmic-revealed'); observer?.unobserve(entry.target); } }), { threshold: .08 });
    const observe = () => document.querySelectorAll('.home-sections > section,.cosmic-closing,.cosmic-page main > section').forEach(section => observer?.observe(section));
    // Wait for deferred route hydration before applying reveal classes.
    const hydrationTimer = window.setTimeout(observe, 1800);
    const mutation = new MutationObserver(() => window.setTimeout(observe, 1800)); mutation.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', update, { passive: true }); document.addEventListener('scroll', update, { capture: true, passive: true }); update();
    return () => { clearTimeout(hydrationTimer); cancelAnimationFrame(frame); observer?.disconnect(); mutation.disconnect(); window.removeEventListener('scroll', update); document.removeEventListener('scroll', update, true); };
  }, []);
  const up = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    window.scrollTo({ top: 0, behavior });
    document.querySelectorAll<HTMLElement>('.cosmic-page [class*="overflow-y-auto"],.chat-messages,.agent-live-wrap').forEach(element => element.scrollTo({ top: 0, behavior }));
  };
  return <div ref={root} className="scroll-atmosphere"><span className="scroll-progress-glow"/>{show && <Button variant="glass" size="icon" className="cosmic-up" onClick={up} aria-label={t('app.shared.up')}><ArrowUp/></Button>}</div>;
}