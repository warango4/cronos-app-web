import PageHeader from '../components/PageHeader';
import {Card} from '../components/ui';

// El diseño no incluye esta pantalla: es solo el destino del menú "Solicitudes".
export default function Requests() {
  return (
    <div className="mx-auto flex w-full max-w-290 flex-col gap-8 p-12">
      <PageHeader title="Solicitudes" subtitle="Invitaciones a alarmas que otras personas compartieron contigo" />
      <Card className="p-12 text-center">No tienes solicitudes por ahora.</Card>
    </div>
  );
}
