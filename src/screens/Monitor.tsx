import {useState} from 'react';
import {PEOPLE, useAlarms} from '../state';
import AlarmTable, {type Column} from '../components/AlarmTable';
import PageHeader from '../components/PageHeader';
import {Chip, StatusBadge} from '../components/ui';

const COLUMNS: Column[] = [
  {label: 'Alarma', className: 'font-semibold', cell: a => a.name},
  {label: 'Hora', width: 120, className: 'font-semibold', cell: a => a.time},
  {label: 'Frecuencia', width: 200, cell: a => a.frequency},
  {label: 'Estado', width: 140, cell: a => <StatusBadge status={a.status} />},
];

export default function Monitor() {
  const {alarms} = useAlarms();
  const [person, setPerson] = useState('Mamá');
  const rows = alarms.filter(a => person === 'Todas' || a.person === person);

  return (
    <div className="mx-auto flex h-screen w-full max-w-290 flex-col gap-8 px-12 pt-12">
      <PageHeader title="Monitorear alarmas compartidas" subtitle="Panel de control de cumplimiento en tiempo real para todos los integrantes registrados" />

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Filtrar panel por persona o grupo</h2>
        <div className="flex flex-wrap gap-2">
          <Chip selected={person === 'Todas'} onClick={() => setPerson('Todas')}>
            Todas ({PEOPLE.length})
          </Chip>
          {PEOPLE.map(p => (
            <Chip key={p.name} selected={person === p.name} onClick={() => setPerson(p.name)}>
              {p.chip}
            </Chip>
          ))}
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col gap-4.5">
        <p className="font-heading text-xl font-semibold">
          Mostrando alarmas de: <span className="font-extrabold text-sage">{person}</span>
        </p>
        <AlarmTable rows={rows} columns={COLUMNS} />
      </section>
    </div>
  );
}
