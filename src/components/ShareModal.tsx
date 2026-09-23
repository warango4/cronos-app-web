import {useState} from 'react';
import {useAlarms} from '../state';
import Modal, {ModalFooter} from './Modal';
import {Avatar, Button, Icon, Switch, cx} from './ui';

const CONTACTS = [
  {name: 'Mamá', linked: true, bg: 'bg-sage'},
  {name: 'Papá', linked: false, bg: 'bg-sage/44'},
  {name: 'Andrés cuidador', linked: true, bg: 'bg-peach'},
  {name: 'Camila', linked: false, bg: 'bg-[#d5d1c9]'},
];

export default function ShareModal({id}: {id: string}) {
  const {setModal, shareAlarm} = useAlarms();
  const [query, setQuery] = useState('');
  // Por defecto van seleccionados los contactos con el celular vinculado.
  const [selected, setSelected] = useState(() => new Set(CONTACTS.filter(c => c.linked).map(c => c.name)));
  const [copied, setCopied] = useState(false);
  const close = () => setModal(null);

  const toggle = (name: string, on: boolean) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (on) next.add(name);
      else next.delete(name);
      return next;
    });

  const generateLink = () => {
    navigator.clipboard?.writeText(`${location.origin}/alarma/${id}`).catch(() => {});
    shareAlarm(id, [...selected]);
    setCopied(true);
    setTimeout(close, 900);
  };

  const visible = CONTACTS.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Modal label="Compartir alarma" onClose={close}>
      <div className="p-8">
        <p className="text-[15px] leading-[22px] text-muted">Selecciona a las personas de tu círculo de confianza que recibirán alertas si no confirmas esta alarma.</p>

        {/* Campo de texto outlined de Material 3 con etiqueta flotante. */}
        <label className="relative mt-4.5 flex h-14 items-center gap-3 rounded border border-sage px-3">
          <span className="absolute -top-2 left-3 bg-white px-1 text-xs text-on-variant">Buscar contacto</span>
          <Icon name="search" className="text-on-variant" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Escribe un nombre..."
            className="min-w-0 flex-1 text-base text-[#1d1b20] outline-none placeholder:text-transparent focus:placeholder:text-ink/50"
          />
        </label>

        <ul className="mt-4.5 flex min-h-73 flex-col gap-3">
          {visible.map(c => (
            <li key={c.name} className="flex h-16 items-center gap-4 rounded-2xl border border-line-soft bg-white px-3">
              <Avatar letter={c.name[0]} bg={c.bg} />
              <div className="flex flex-1 flex-col gap-0.5 leading-none text-muted">
                <span className="text-base font-semibold">{c.name}</span>
                <span className={cx('text-[13px]', c.linked && 'text-sage')}>{c.linked ? 'Celular vinculado' : 'Sin vincular'}</span>
              </div>
              <Switch label={`Compartir con ${c.name}`} checked={selected.has(c.name)} onChange={on => toggle(c.name, on)} />
            </li>
          ))}
        </ul>

        {/* Indicador de páginas del diseño. */}
        <div aria-hidden className="mt-5 flex justify-center gap-2">
          <span className="size-2 rounded-full bg-sage" />
          <span className="size-2 rounded-full bg-line-soft" />
          <span className="size-2 rounded-full bg-line-soft" />
        </div>
      </div>
      <ModalFooter>
        <Button variant="text" onClick={close}>
          Cancelar
        </Button>
        <Button variant="outline" tone="sage" onClick={generateLink} disabled={copied}>
          {copied ? 'Enlace copiado' : 'Generar enlace para compartir'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
