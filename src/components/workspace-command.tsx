import { t, localized, useI18n, getLocale, formatNumber, relativeTime, plural } from '@/i18n';
import { useEffect, useRef, useState } from 'react';
import { Search, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type WorkspaceCommand = { label: string; group: string; run: () => void };

export function AIText({ text }: { text: string }) {
  useI18n();
  return <>{text.split(/(\bAI\b)/g).map((part, index) => part === 'AI' ? <span className="ai" key={index}>AI</span> : part)}</>;
}

export function WorkspaceCommandPalette({ commands, onClose }: { commands: WorkspaceCommand[]; onClose: () => void }) {
  useI18n();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const filtered = commands.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector('input')?.focus();
    return () => previous?.focus();
  }, []);
  const execute = (command?: WorkspaceCommand) => { if (!command) return; onClose(); command.run(); };
  return <div className="modal-overlay" onMouseDown={event => { if (event.currentTarget === event.target) onClose(); }}>
    <div className="command-palette" ref={dialogRef} role="dialog" aria-modal="true" aria-label={t("app.workspace.tezkor_qidiruv")} onKeyDown={event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setSelected(value => (value + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % Math.max(filtered.length, 1)); }
      if (event.key === 'Enter') { event.preventDefault(); execute(filtered[selected]); }
      if (event.key === 'Tab') {
        const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('input,button') ?? []);
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <div className="command-search"><Search /><input aria-label={t("app.command.qidiruv")} placeholder={t("app.command.agent_shablon_yoki_sahifa")} value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} /><Button variant="workspace" size="workspace" className="icon-button" aria-label={t("app.command.qidiruvni_yopish")} onClick={onClose}><X /></Button></div>
      <div className="command-results">{filtered.map((command, index) => <div key={`${command.group}-${command.label}`}>
        {(index === 0 || filtered[index - 1]?.group !== command.group) && <p className="section-kicker">{command.group}</p>}
        <Button variant="workspace" size="workspace" className={`command-result ${index === selected ? 'selected' : ''}`} onMouseEnter={() => setSelected(index)} onClick={() => execute(command)}><AIText text={command.label} /><ArrowUpRight /></Button>
      </div>)}{!filtered.length && <p className="command-empty">{t("app.agents.hech_narsa_topilmadi")}</p>}</div>
    </div>
  </div>;
}