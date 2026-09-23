import type {ReactNode} from 'react';

// Fila "etiqueta — valor". Con `icon` es la versión de "Detalles de programación";
// sin él, la versión compacta del popup "Alarma creada".
export default function DetailRow({label, value, icon}: {label: ReactNode; value?: ReactNode; icon?: ReactNode}) {
  return icon ? (
    <div className="flex items-center justify-between gap-4 border-b border-line py-3 text-[15px] last:border-b-0">
      <span className="flex items-center gap-3 font-semibold">
        {icon}
        {label}
      </span>
      {value && <span>{value}</span>}
    </div>
  ) : (
    <div className="flex items-center justify-between border-b border-[#f5f5f5] pt-[11px] pb-3 text-sm first:pt-0 last:border-b-0 last:pb-0">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-[#1a1a1a]">{value}</span>
    </div>
  );
}
