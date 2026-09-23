import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router';
import {useAlarms} from '../state';
import {MONTHS, TIME_OPTIONS, nextHour, plural} from '../utils';
import Calendar from '../components/Calendar';
import {Button, Chip, Field, Segmented, Select, control} from '../components/ui';

const PEOPLE_OPTIONS = ['Yo', 'Mamá', 'Mascota'] as const;
const MULTIPLE = 'Varias veces al día';
const FREQUENCIES = ['Diaria', MULTIPLE, 'Semanal', 'Mensual'];
const SOUNDS = ['Predeterminado', 'Suave', 'Campana', 'Digital'];

export default function NewAlarm() {
  const {addAlarm, setModal} = useAlarms();
  const navigate = useNavigate();

  // Valores iniciales tomados del mockup.
  const [name, setName] = useState('Pastilla presión – Mamá');
  const [person, setPerson] = useState<(typeof PEOPLE_OPTIONS)[number]>('Mamá');
  // "Otro": como en mobile, deselecciona el segmentado y pide el nombre en un campo aparte.
  const [isOther, setIsOther] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [start, setStart] = useState('18:30');
  const [frequency, setFrequency] = useState(MULTIPLE);
  const [times, setTimes] = useState(['07:00', '19:00']);
  const [addingTime, setAddingTime] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [repeat, setRepeat] = useState('10 días');
  const [sound, setSound] = useState(SOUNDS[0]);
  const [date, setDate] = useState(() => new Date());

  // "+ Agregar horario" abre un campo para escribir la hora; se agrega al confirmar
  // (Enter o perder el foco), no de una vez con un valor calculado.
  const confirmTime = () => {
    if (newTime && !times.includes(newTime)) setTimes([...times, newTime].sort());
    setAddingTime(false);
    setNewTime('');
  };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const days = parseInt(repeat) || 1;
    const end = new Date(date);
    end.setDate(end.getDate() + days);
    const alarm = addAlarm({
      name: name.trim(),
      person: isOther ? otherName.trim() || 'Otro' : person,
      time: frequency === MULTIPLE ? times.join(', ') || start : start,
      frequency,
      status: 'Aceptada',
      repeat: plural(days, 'día', 'días'),
      until: `${end.getDate()} de ${MONTHS[end.getMonth()]} (${plural(days, 'día restante', 'días restantes')})`,
      done: 0,
      total: 0,
      sharedWith: ['Tú'],
    });
    // Como en el prototipo: vuelve a la lista con el popup encima.
    navigate('/');
    setModal({kind: 'creada', id: alarm.id});
  };

  return (
    <div className="flex min-h-screen">
      {/* El margen izquierdo replica el centrado de "Todas las alarmas" (mx-auto max-w-290
          dentro de main). Como aquí el panel de 460px ya le resta ancho a este flex-1, ese
          centrado no puede calcularse con % (se basaría en el ancho ya reducido); se calcula
          con 100vw en su lugar: sidebar 280px + contenido máx. 1160px = 1440px de referencia. */}
      <div className="min-w-0 flex-1 pt-12 pr-12 pb-12" style={{paddingLeft: 'max(3rem, calc((100vw - 90rem) / 2 + 3rem))'}}>
        <h1 className="mb-9 font-heading text-[26px] font-semibold text-muted">Nueva alarma — vista calendario</h1>
        <Calendar selected={date} onSelect={setDate} tag="Nueva alarma" />
      </div>

      <form onSubmit={save} className="flex w-115 shrink-0 flex-col gap-6 border-l border-[#fdf0eb] bg-sage/4 p-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-lg leading-tight font-semibold text-ink-strong">{name.trim() || 'Nueva alarma'}</h2>
          <p className="text-sm">Configure los horarios y el destinatario de la alerta</p>
        </div>

        <div className="flex flex-col gap-5">
          <Field label="Nombre de la alarma">
            <input required value={name} onChange={e => setName(e.target.value)} className={control} />
          </Field>

          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold">¿Para quién es?</span>
            <Segmented
              options={PEOPLE_OPTIONS}
              value={isOther ? undefined : person}
              onChange={v => {
                setPerson(v);
                setIsOther(false);
              }}
            />
            <button type="button" onClick={() => setIsOther(true)} className="self-end text-xs font-medium text-ink/60 underline decoration-ink/40 underline-offset-2 hover:text-ink">
              Otro
            </button>
            {isOther && (
              <Field label="¿Quién es?">
                <input required autoFocus value={otherName} onChange={e => setOtherName(e.target.value)} placeholder="Nombre" className={control} />
              </Field>
            )}
          </div>

          <div className="flex gap-4">
            <Field label="Hora de inicio" className="flex-1">
              <Select value={start} onChange={e => setStart(e.target.value)}>
                {TIME_OPTIONS.map(t => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Field label="Frecuencia" className="flex-1">
              <Select value={frequency} onChange={e => setFrequency(e.target.value)}>
                {FREQUENCIES.map(f => (
                  <option key={f}>{f}</option>
                ))}
              </Select>
            </Field>
          </div>

          {frequency === MULTIPLE && (
            <div className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4">
              <span className="text-sm font-semibold">Horarios del día</span>
              <div className="flex flex-wrap gap-2">
                {times.map(t => (
                  <Chip key={t} variant="input" onRemove={() => setTimes(times.filter(x => x !== t))}>
                    {t}
                  </Chip>
                ))}
                {addingTime ? (
                  <input
                    type="time"
                    autoFocus
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    onBlur={confirmTime}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        confirmTime();
                      }
                      if (e.key === 'Escape') {
                        setAddingTime(false);
                        setNewTime('');
                      }
                    }}
                    className="h-8 rounded-lg border border-line px-2 text-sm"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setNewTime(nextHour(times.at(-1) ?? start));
                      setAddingTime(true);
                    }}
                    className="rounded-lg bg-sage-tint px-3 py-1.5 text-[13px] font-semibold text-sage hover:brightness-95">
                    + Agregar horario
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Field label="Repetir por" className="flex-1">
              <input inputMode="numeric" value={repeat} onChange={e => setRepeat(e.target.value)} className={control} />
            </Field>
            <Field label="Sonido" className="flex-1">
              <Select value={sound} onChange={e => setSound(e.target.value)}>
                {SOUNDS.map(s => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Button type="submit" shape="round" full className="h-auto py-4">
            Guardar alarma
          </Button>
        </div>
      </form>
    </div>
  );
}
