import {Link, Navigate, useNavigate, useParams} from 'react-router';
import {Calendar, CircleCheck, Clock, Info, RefreshCw, Users} from 'lucide-react';
import {personLabel, useAlarms} from '../state';
import DetailRow from '../components/DetailRow';
import {Avatar, Button, Card, Icon, StatusBadge} from '../components/ui';

const ICON = {size: 20, strokeWidth: 1.5};
const LONG_FREQUENCY: Record<string, string> = {Diaria: 'Todos los días'};

export default function AlarmDetail() {
  const {id} = useParams();
  const {alarms, removeAlarm, setModal} = useAlarms();
  const navigate = useNavigate();
  const alarm = alarms.find(a => a.id === id);
  if (!alarm) return <Navigate to="/" replace />;

  const others = alarms.filter(a => a.id !== alarm.id && !a.monitorOnly).slice(0, 3);
  const progress = alarm.total ? (alarm.done / alarm.total) * 100 : 0;

  const remove = () => {
    if (!confirm(`¿Eliminar "${alarm.name}"?`)) return;
    removeAlarm(alarm.id);
    navigate('/');
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-290 flex-col gap-8 p-12">
      <div className="flex items-center gap-6 rounded-3xl border border-sage bg-sage-tint/40 p-8">
        <Avatar letter={alarm.person[0]} size={72} className="font-heading font-semibold text-[32px]!" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-4">
            <h1 className="font-heading text-[28px] leading-tight font-semibold">{alarm.name}</h1>
            <StatusBadge status={alarm.status} />
          </div>
          <p className="text-base">Compartida con: {alarm.sharedWith.join(', ')}</p>
        </div>
        <div className="flex gap-3">
          {/* Editar no tiene flujo en el prototipo. */}
          <Button size="sm" shape="round" variant="outline" disabled title="No disponible en el prototipo">
            <Icon name="edit" size={16} fill /> Editar
          </Button>
          <Button size="sm" shape="round" variant="outline" tone="sage" onClick={() => setModal({kind: 'compartir', id: alarm.id})}>
            <Icon name="share" size={16} fill /> Compartir
          </Button>
          <Button size="sm" shape="round" variant="outline" tone="err" onClick={remove}>
            <Icon name="delete" size={16} fill /> Eliminar
          </Button>
        </div>
      </div>

      {/* flex-1: se extiende al espacio disponible, igual que la tabla de la Lista. */}
      <div className="grid min-h-0 flex-1 grid-cols-[552fr_480fr] gap-8">
        <Card className="overflow-y-auto p-8">
          <h2 className="mb-4 font-heading text-lg font-semibold">Detalles de programación</h2>
          <DetailRow icon={<Clock {...ICON} />} label="Hora" value={`${alarm.time} ${alarm.frequency}`} />
          <DetailRow icon={<RefreshCw {...ICON} />} label="Frecuencia" value={LONG_FREQUENCY[alarm.frequency] ?? alarm.frequency} />
          <DetailRow icon={<Users {...ICON} />} label="Asignado a" value={personLabel(alarm.person)} />
          <DetailRow icon={<Calendar {...ICON} />} label="Repite hasta" value={alarm.until} />
          <DetailRow icon={<CircleCheck {...ICON} />} label={<>Cumplimiento esta semana <Info size={14} strokeWidth={1.5} aria-label="Veces marcadas como cumplidas en la semana" /></>} />
          <div role="progressbar" aria-valuenow={Math.round(progress)} aria-label="Cumplimiento esta semana" className="mt-1 h-2 overflow-hidden rounded bg-sage/13">
            <div className="h-full bg-sage" style={{width: `${progress}%`}} />
          </div>
          <p className="mt-5 text-[15px]">{alarm.total ? `${alarm.done} de ${alarm.total} veces marcadas como cumplida` : 'Aún sin registros esta semana'}</p>
        </Card>

        <Card className="flex flex-col gap-5 overflow-y-auto p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Otras alarmas</h2>
            <Link to="/" className="text-sm font-medium text-sage">
              Ver todas →
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {others.map(o => (
              <li key={o.id}>
                <Link to={`/alarma/${o.id}`} className="flex items-center gap-3 rounded-xl bg-cream p-3 hover:brightness-97">
                  <Avatar letter={o.person[0]} size={32} bg="bg-peach" className="font-heading font-semibold text-sm!" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1.5 leading-none">
                    <span className="truncate text-sm font-semibold">{o.name}</span>
                    <span className="truncate text-xs">
                      {o.time} {o.frequency}
                    </span>
                  </span>
                  <StatusBadge status={o.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
