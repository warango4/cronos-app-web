import type {ReactNode} from 'react';
import {Link, useNavigate} from 'react-router';
import type {Alarm} from '../state';
import {cx} from './ui';

export type Column = {label: string; width?: number; className?: string; cell: (a: Alarm) => ReactNode};

// Tabla compartida por "Lista de alarmas" y "Monitorear". Si recibe `to`, la
// primera celda es un enlace y toda la fila navega al hacer clic. Ocupa el alto
// que le deje el flex-col del contenedor (ver AlarmList/Monitor): por eso solo
// redondea las esquinas de arriba y desplaza con encabezado fijo si hay muchas filas.
export default function AlarmTable({rows, columns, to, empty = 'No hay alarmas para mostrar.'}: {rows: Alarm[]; columns: Column[]; to?: (a: Alarm) => string; empty?: string}) {
  const navigate = useNavigate();
  // Como en el diseño, el padding de 18px es de la fila (no de cada celda): las
  // columnas miden exactamente su ancho y el borde lo aportan la primera y la última.
  const last = columns.length - 1;
  const pad = (i: number) => cx('py-4.5', i === 0 && 'pl-4.5', i === last && 'pr-4.5');
  return (
    <div className="min-h-0 flex-1 overflow-y-auto rounded-t-2xl border border-line bg-white">
      <table className="w-full table-fixed text-left text-[15px]">
        <colgroup>
          {columns.map((c, i) => (
            <col key={c.label} style={{width: c.width && c.width + (i === last ? 18 : 0)}} />
          ))}
        </colgroup>
        <thead className="sticky top-0 z-10 bg-head font-heading font-semibold text-muted">
          <tr className="border-b border-line">
            {columns.map((c, i) => (
              <th key={c.label} scope="col" className={cx('font-semibold', pad(i))}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(a => (
            <tr
              key={a.id}
              onClick={to ? e => !(e.target as HTMLElement).closest('a') && navigate(to(a)) : undefined}
              className={cx('border-b border-line last:border-b-0', to && 'cursor-pointer hover:bg-cream')}>
              {columns.map((c, i) => (
                <td key={c.label} className={cx(pad(i), c.className)}>
                  {to && i === 0 ? <Link to={to(a)}>{c.cell(a)}</Link> : c.cell(a)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
