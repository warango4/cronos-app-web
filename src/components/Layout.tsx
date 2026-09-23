import {Link, Outlet, useLocation} from 'react-router';
import {Activity, Bell, Settings, Users} from 'lucide-react';
import {useAlarms} from '../state';
import {Avatar, Icon, cx} from './ui';
import AlarmCreatedModal from './AlarmCreatedModal';
import ShareModal from './ShareModal';

const NAV = [
  // "bold" engrosa el trazo del ícono (sigue de línea, no relleno) para destacarlo.
  {label: 'Lista de alarmas', to: '/', icon: Bell, bold: true, active: (p: string) => !['/monitorear', '/solicitudes'].includes(p)},
  {label: 'Solicitudes', to: '/solicitudes', icon: Users, active: (p: string) => p === '/solicitudes'},
  {label: 'Monitorear (vista filtrada)', to: '/monitorear', icon: Activity, active: (p: string) => p === '/monitorear'},
  {label: 'Configuración', icon: Settings},
];

const itemClass = 'flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] whitespace-nowrap';

function Sidebar() {
  const {pathname} = useLocation();
  return (
    <aside className="sticky top-0 flex h-screen w-70 shrink-0 flex-col gap-12 border-r border-line bg-sidebar px-6 py-8">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-[10px] bg-peach text-white">
          <Icon name="alarm" fill />
        </span>
        <span className="font-heading text-[26px] font-extrabold">Cronos</span>
      </div>

      <nav className="flex flex-col gap-2">
        {NAV.map(({label, icon: Glyph, to, active, bold}) => {
          const on = !!active?.(pathname);
          const strokeWidth = bold ? 2.75 : 1.5;
          return to ? (
            <Link key={label} to={to} aria-current={on ? 'page' : undefined} className={cx(itemClass, on ? 'bg-peach font-semibold text-white' : 'font-medium hover:bg-black/5')}>
              <Glyph size={20} strokeWidth={strokeWidth} />
              {label}
            </Link>
          ) : (
            // Sin destino en el prototipo.
            <button key={label} type="button" disabled title="No disponible en el prototipo" className={cx(itemClass, 'font-medium disabled:cursor-not-allowed')}>
              <Glyph size={20} strokeWidth={strokeWidth} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex h-15 items-center gap-2.5 rounded-xl border border-line bg-white px-2.5">
        <Avatar letter="M" className="font-heading font-extrabold" />
        <div className="flex flex-col gap-0.5 leading-none">
          <span className="font-heading text-sm font-semibold">María P.</span>
          <span className="text-[11px]">Cuidador principal</span>
        </div>
      </div>
    </aside>
  );
}

// Sidebar pegado al borde izquierdo. El ancho máximo para no estirarse en
// monitores muy anchos lo decide cada pantalla (ver AlarmList, Monitor...);
// Nueva alarma lo omite a propósito para usar todo el ancho hasta el borde.
export default function Layout() {
  const {modal} = useAlarms();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
      {modal?.kind === 'creada' && <AlarmCreatedModal id={modal.id} />}
      {modal?.kind === 'compartir' && <ShareModal id={modal.id} />}
    </div>
  );
}
