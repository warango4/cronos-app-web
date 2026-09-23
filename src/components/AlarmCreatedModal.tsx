import {useNavigate} from 'react-router';
import illustration from '../assets/alarma-creada.png';
import {useAlarms} from '../state';
import DetailRow from './DetailRow';
import Modal, {ModalFooter} from './Modal';
import {Button} from './ui';

export default function AlarmCreatedModal({id}: {id: string}) {
  const {alarms, setModal} = useAlarms();
  const navigate = useNavigate();
  const alarm = alarms.find(a => a.id === id);
  const close = () => setModal(null);

  return (
    <Modal label="Alarma creada" onClose={close}>
      <div className="px-12 pt-7.25 pb-13">
        {/* Recorte de la ilustración, tal como está en el diseño. */}
        <div className="relative mx-auto h-43.5 w-54 overflow-hidden">
          <img alt="" src={illustration} className="absolute -top-[22.4%] -left-[6.14%] h-[138.25%] w-[110.96%] max-w-none" />
        </div>
        <h2 className="mt-3.75 text-center font-heading text-xl font-semibold text-muted">Alarma creada satisfactoriamente</h2>
        <div className="mt-9.25">
          <DetailRow label="Hora" value={alarm?.time} />
          <DetailRow label="Frecuencia" value={alarm?.frequency} />
          <DetailRow label="Para quién es" value={alarm?.person} />
          <DetailRow label="Repite hasta" value={alarm?.repeat} />
        </div>
      </div>
      <ModalFooter>
        <Button variant="text" onClick={close}>
          Continuar
        </Button>
        <Button
          onClick={() => {
            // Como en el prototipo: abre el detalle y encima el popup de compartir.
            navigate(`/alarma/${id}`);
            setModal({kind: 'compartir', id});
          }}>
          Compartir alarma
        </Button>
      </ModalFooter>
    </Modal>
  );
}
