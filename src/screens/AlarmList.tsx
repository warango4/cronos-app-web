import {useState} from 'react';
import {Link} from 'react-router';
import {PEOPLE, useAlarms} from '../state';
import AlarmTable, {type Column} from '../components/AlarmTable';
import PageHeader from '../components/PageHeader';
import {Card, Icon, Select, StatusBadge, btn, cx} from '../components/ui';

const TABS = [
  {id: 'todas', label: 'Todas las alarmas'},
  {id: 'pendientes', label: 'Pendientes'},
] as const;

const COLUMNS: Column[] = [
  {label: 'Alarma', className: 'text-muted', cell: a => a.name},
  {label: 'Para quién', width: 180, className: 'text-muted', cell: a => a.person},
  {label: 'Hora', width: 120, className: 'font-semibold text-muted', cell: a => a.time},
  {label: 'Frecuencia', width: 160, cell: a => a.frequency},
  {label: 'Estado', width: 140, cell: a => <StatusBadge status={a.status} />},
];

export default function AlarmList() {
  const {alarms} = useAlarms();
  const [query, setQuery] = useState('');
  const [person, setPerson] = useState('Todos');
  const [sort, setSort] = useState('hora');
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('todas');

  const rows = alarms.filter(
    a =>
      !a.monitorOnly &&
      (tab === 'todas' || a.status === 'Pendiente') &&
      (person === 'Todos' || a.person === person) &&
      a.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  // "Hora" conserva el orden de programación (el diseño lista sin reordenar).
  if (sort === 'nombre') rows.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'estado') rows.sort((a, b) => a.status.localeCompare(b.status));

  return (
    <div className="mx-auto flex h-screen w-full max-w-290 flex-col gap-8 px-12 pt-12">
      <PageHeader
        title="Todas las alarmas"
        subtitle="Gestión y seguimiento de alertas propias y compartidas de la familia"
        action={
          <Link to="/nueva" className={cx(btn(), 'shrink-0 gap-2 px-4 tracking-[0.15px]')}>
            <Icon name="add" />
            Nueva alarma
          </Link>
        }
      />

      <Card className="flex items-center gap-4 p-6">
        <label className="flex h-14 w-85 max-w-180 items-center rounded-[28px] bg-sage/8 pr-5">
          <span className="grid size-12 place-items-center">
            <Icon name="search" />
          </span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar alarma o medicamento..."
            className="min-w-0 flex-1 tracking-[0.5px] outline-none placeholder:text-ink"
          />
        </label>
        <Select tinted aria-label="Filtrar por familiar" className="w-65" value={person} onChange={e => setPerson(e.target.value)}>
          <option value="Todos">Filtrar por familiar: Todos</option>
          {PEOPLE.map(p => (
            <option key={p.name} value={p.name}>
              Filtrar por familiar: {p.name}
            </option>
          ))}
        </Select>
        <Select tinted aria-label="Ordenar" className="w-50" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="hora">Ordenar por: Hora</option>
          <option value="nombre">Ordenar por: Nombre</option>
          <option value="estado">Ordenar por: Estado</option>
        </Select>
      </Card>

      <div role="tablist" className="flex gap-8 border-b border-line">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cx('border-b-3 pb-1 text-base', tab === t.id ? 'border-sage font-semibold text-sage' : 'border-transparent font-medium')}>
            {t.label}
          </button>
        ))}
      </div>

      <AlarmTable rows={rows} columns={COLUMNS} to={a => `/alarma/${a.id}`} />
    </div>
  );
}
