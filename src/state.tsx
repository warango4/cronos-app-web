import {createContext, useContext, useState, type ReactNode} from 'react';

export type Status = 'Aceptada' | 'Pendiente' | 'Vencida';

export type Alarm = {
  id: string;
  name: string;
  person: string;
  time: string;
  frequency: string;
  status: Status;
  repeat: string; // "10 días"
  until: string; // "28 de Septiembre (10 días restantes)"
  done: number; // cumplimiento de la semana
  total: number;
  sharedWith: string[];
  monitorOnly?: boolean; // solo aparece en Monitorear y en "Otras alarmas", no en la lista
};

export const PEOPLE = [
  {name: 'Mamá', chip: 'Mamá', tag: 'Familia'},
  {name: 'Papá', chip: 'Papá', tag: 'Familia'},
  {name: 'Sofía', chip: 'Sofía', tag: 'Familia'},
  {name: 'Rex', chip: 'Rex (Mascota)', tag: 'Mascota'},
];

export const personLabel = (person: string) => {
  const tag = PEOPLE.find(p => p.name === person)?.tag;
  return tag ? `${person} (${tag})` : person;
};

const seed = (a: Partial<Alarm> & Pick<Alarm, 'id' | 'name' | 'person' | 'time' | 'frequency' | 'status'>): Alarm => ({
  repeat: '10 días',
  until: '28 de Septiembre (10 días restantes)',
  done: 3,
  total: 3,
  sharedWith: ['Tú', a.person],
  ...a,
});

// Datos de ejemplo tomados de los mockups.
const SEED: Alarm[] = [
  seed({id: '1', name: 'Pastilla presión – Mamá', person: 'Mamá', time: '07:00', frequency: 'Diaria', status: 'Aceptada'}),
  seed({id: '2', name: 'Recoger a Sofía', person: 'Sofía', time: '15:30', frequency: 'Lunes a Viernes', status: 'Pendiente', done: 2, total: 5}),
  seed({id: '3', name: 'Terapia física – Papá', person: 'Papá', time: '11:00', frequency: 'Mar / Jue', status: 'Vencida', done: 1, total: 2}),
  seed({id: '4', name: 'Tomar agua – Mamá', person: 'Mamá', time: 'Cada 2 horas', frequency: '08:00 - 20:00', status: 'Aceptada', done: 18, total: 21}),
  seed({id: '5', name: 'Control médico – Mamá', person: 'Mamá', time: '16:00', frequency: 'Mensual', status: 'Vencida', done: 0, total: 1, monitorOnly: true}),
  seed({id: '6', name: 'Vitaminas Rex', person: 'Rex', time: '09:00', frequency: 'Diaria', status: 'Aceptada', done: 6, total: 7, monitorOnly: true}),
];

type Modal = {kind: 'creada' | 'compartir'; id: string} | null;

type Store = {
  alarms: Alarm[];
  modal: Modal;
  setModal: (m: Modal) => void;
  addAlarm: (a: Omit<Alarm, 'id'>) => Alarm;
  removeAlarm: (id: string) => void;
  shareAlarm: (id: string, names: string[]) => void;
};

const AlarmsContext = createContext<Store | null>(null);

export function AlarmsProvider({children}: {children: ReactNode}) {
  // ponytail: estado en memoria, se reinicia al recargar; localStorage o API cuando haya que persistir.
  const [alarms, setAlarms] = useState(SEED);
  const [modal, setModal] = useState<Modal>(null);

  const addAlarm: Store['addAlarm'] = a => {
    const alarm = {...a, id: crypto.randomUUID()};
    setAlarms(prev => [...prev, alarm]);
    return alarm;
  };

  const removeAlarm: Store['removeAlarm'] = id => setAlarms(prev => prev.filter(a => a.id !== id));

  // Al compartir queda a la espera de que los invitados acepten.
  const shareAlarm: Store['shareAlarm'] = (id, names) =>
    setAlarms(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              status: names.length ? 'Pendiente' : a.status,
              sharedWith: [...new Set([...a.sharedWith, ...names])],
            }
          : a,
      ),
    );

  return (
    <AlarmsContext value={{alarms, modal, setModal, addAlarm, removeAlarm, shareAlarm}}>
      {children}
    </AlarmsContext>
  );
}

export function useAlarms() {
  const ctx = useContext(AlarmsContext);
  if (!ctx) throw new Error('useAlarms must be used inside <AlarmsProvider>');
  return ctx;
}
