import type {ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes} from 'react';
import {ChevronDown} from 'lucide-react';
import type {Status} from '../state';

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

// Material Symbols (fuente de Google Fonts, cargada en index.html). Se usa para los
// íconos del kit Material 3 del diseño; los demás vienen de lucide-react.
export function Icon({name, size = 24, fill = false, className}: {name: string; size?: number; fill?: boolean; className?: string}) {
  return (
    <span
      aria-hidden
      className={cx('material-symbols-outlined select-none overflow-hidden', className)}
      style={{fontSize: size, width: size, height: size, fontVariationSettings: `'FILL' ${fill ? 1 : 0}`}}>
      {name}
    </span>
  );
}

/* ---------- Botón (Material 3: filled / outlined / text) ---------- */

type BtnOpts = {
  variant?: 'filled' | 'outline' | 'text';
  tone?: 'peach' | 'sage' | 'err';
  shape?: 'square' | 'round';
  size?: 'sm' | 'md';
  full?: boolean;
};

const OUTLINE_TONE = {peach: 'border-peach text-peach', sage: 'border-sage text-sage', err: 'border-err text-err'};

// Devuelve las clases para poder aplicarlas también a un <Link>.
export function btn({variant = 'filled', tone = 'peach', shape = 'square', size = 'md', full}: BtnOpts = {}) {
  return cx(
    'inline-flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed',
    size === 'sm' ? 'h-10 px-4 text-sm font-medium' : 'h-14 px-6 text-base',
    shape === 'round' ? 'rounded-full' : 'rounded-2xl',
    full && 'w-full',
    variant === 'filled' && 'bg-peach font-semibold text-white hover:brightness-95',
    variant === 'outline' && cx('bg-white hover:bg-current/8', size === 'sm' ? 'border' : 'border-2 font-semibold', OUTLINE_TONE[tone]),
    variant === 'text' && 'font-normal text-muted hover:bg-current/8',
  );
}

export function Button({variant, tone, shape, size, full, className, ...props}: BtnOpts & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={cx(btn({variant, tone, shape, size, full}), className)} {...props} />;
}

/* ---------- Contenedores y datos ---------- */

export const Card = ({className, children}: {className?: string; children: ReactNode}) => (
  <div className={cx('rounded-2xl border border-line bg-white', className)}>{children}</div>
);

export function Avatar({letter, size = 40, bg = 'bg-sage', className}: {letter: string; size?: number; bg?: string; className?: string}) {
  return (
    <span
      aria-hidden
      className={cx('grid shrink-0 place-items-center rounded-full font-semibold text-white', bg, className)}
      style={{width: size, height: size, fontSize: size * 0.4}}>
      {letter}
    </span>
  );
}

const STATUS_STYLE: Record<Status, string> = {
  Aceptada: 'bg-ok-bg text-ok',
  Pendiente: 'bg-warn-bg text-warn',
  Vencida: 'bg-err-bg text-err',
};

export const StatusBadge = ({status}: {status: Status}) => (
  <span className={cx('inline-flex rounded-full px-2.5 py-1 text-[13px] font-semibold whitespace-nowrap', STATUS_STYLE[status])}>{status}</span>
);

/* ---------- Chips: "filter" (Monitorear) e "input" (horarios) ---------- */

export function Chip({variant = 'filter', selected, onRemove, children, ...props}: {variant?: 'filter' | 'input'; selected?: boolean; onRemove?: () => void} & ButtonHTMLAttributes<HTMLButtonElement>) {
  // Un solo borde de 1px (antes había border + ring apilados, se veía grueso y oscuro).
  const base = 'inline-flex h-8 items-center rounded-lg border text-sm font-medium';
  if (variant === 'input')
    return (
      <span className={cx(base, 'gap-1 border-peach bg-peach-tint px-3 text-peach')}>
        {children}
        <button type="button" aria-label={`Quitar ${children}`} onClick={onRemove}>✕</button>
      </span>
    );
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(base, 'px-4', selected ? 'border-peach bg-peach text-white' : 'border-line bg-white text-on-variant hover:bg-cream')}
      {...props}>
      {children}
    </button>
  );
}

/* ---------- Formularios ---------- */

export const control = 'h-10 w-full rounded-lg border border-line bg-white px-4 placeholder:text-ink/50 focus:border-sage';

// El tamaño de texto se hereda: lo fija el contenedor (Field usa text-sm).
export function Field({label, children, className}: {label: string; children: ReactNode; className?: string}) {
  return (
    <label className={cx('flex flex-col gap-2 text-sm', className)}>
      <span className="leading-[1.4] font-semibold">{label}</span>
      {children}
    </label>
  );
}

export function Select({className, tinted, children, ...props}: {tinted?: boolean} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className={cx('relative block', className)}>
      <select className={cx(control, 'appearance-none pr-10', tinted && 'bg-sage/4')} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
    </span>
  );
}

export function Segmented<T extends string>({options, value, onChange, pill, className}: {options: readonly T[]; value?: T; onChange: (v: T) => void; pill?: boolean; className?: string}) {
  return (
    <div className={cx('flex border border-line p-1', pill ? 'rounded-full bg-head' : 'rounded-xl bg-white', className)}>
      {options.map(o => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={cx('py-2 text-sm', pill ? 'rounded-full px-4 py-1.5' : 'flex-1 rounded-lg', o === value ? 'bg-sage font-semibold text-white' : 'hover:bg-black/5')}>
          {o}
        </button>
      ))}
    </div>
  );
}

// Interruptor Material 3: pista 52×32, pulgar 16 → 24 (medidas del kit M3 del diseño).
export function Switch({checked, onChange, label}: {checked: boolean; onChange: (v: boolean) => void; label: string}) {
  return (
    <label className="relative inline-flex shrink-0">
      <input type="checkbox" role="switch" className="peer sr-only" checked={checked} aria-label={label} onChange={e => onChange(e.target.checked)} />
      <span className="h-8 w-13 rounded-full border-2 border-[#9e9e9e] bg-[#e6e0e9] transition-colors duration-200 peer-checked:border-sage peer-checked:bg-sage peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sage" />
      <span className="absolute top-2 left-2 size-4 rounded-full bg-[#9e9e9e] transition-all duration-200 peer-checked:top-1 peer-checked:left-6 peer-checked:size-6 peer-checked:bg-white" />
    </label>
  );
}
