import {useState} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {MONTHS, buildMonthGrid, sameDay} from '../utils';
import {Segmented, cx} from './ui';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const VIEWS = ['Día', 'Semana', 'Mes'] as const;

const navButton = 'grid size-8 place-items-center rounded-2xl border-[0.75px] border-line bg-white hover:bg-cream';

// Calendario mensual (lunes a domingo). "Semana" muestra solo la semana del día
// elegido y "Día" solo su columna.
export default function Calendar({selected, onSelect, tag}: {selected: Date; onSelect: (d: Date) => void; tag: string}) {
  const [cursor, setCursor] = useState({y: selected.getFullYear(), m: selected.getMonth()});
  const [view, setView] = useState<(typeof VIEWS)[number]>('Mes');

  const move = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({y: d.getFullYear(), m: d.getMonth()});
  };

  const weeks = buildMonthGrid(cursor.y, cursor.m);
  const inMonth = selected.getFullYear() === cursor.y && selected.getMonth() === cursor.m;
  const weekOfSelected = Math.max(0, weeks.findIndex(w => inMonth && w.includes(selected.getDate())));
  const rows = view === 'Mes' ? weeks : [weeks[weekOfSelected]];
  const cols = view === 'Día' ? [(selected.getDay() + 6) % 7] : DAYS.map((_, i) => i);

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold text-muted">
            {MONTHS[cursor.m]} {cursor.y}
          </h2>
          <div className="flex gap-1">
            <button type="button" aria-label="Mes anterior" className={navButton} onClick={() => move(-1)}>
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Mes siguiente" className={navButton} onClick={() => move(1)}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <Segmented pill options={VIEWS} value={view} onChange={setView} />
      </div>

      {/* max-w-266 = 1064px: mismo ancho de contenido que la Lista (max-w-290 con px-12 de margen). */}
      <div className="mt-5 max-w-266 overflow-hidden rounded-lg border border-line">
        <div className="grid border-b border-line bg-head text-xs font-semibold" style={{gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`}}>
          {cols.map(c => (
            <span key={c} className="p-3 text-center">
              {DAYS[c]}
            </span>
          ))}
        </div>
        {rows.map((week, r) => (
          <div key={r} className="grid border-b border-[#e5e5e5] last:border-b-0" style={{gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`}}>
            {cols.map(c => {
              const day = week[c];
              const date = day ? new Date(cursor.y, cursor.m, day) : null;
              const on = !!date && sameDay(date, selected);
              return (
                <button
                  key={c}
                  type="button"
                  disabled={!date}
                  onClick={() => date && onSelect(date)}
                  className={cx('flex h-20 flex-col items-start gap-2 border-r border-[#e5e5e5] p-4 text-left text-xs last:border-r-0 enabled:hover:bg-cream', on ? 'bg-cream font-semibold' : 'font-medium')}>
                  {day}
                  {on && <span className="max-w-full truncate rounded bg-ok px-1 py-0.5 text-[9px] font-normal text-white">{tag}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
