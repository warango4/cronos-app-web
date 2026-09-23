import {useEffect, useRef, type ReactNode} from 'react';

// Popup con el <dialog> nativo: backdrop, foco atrapado y Esc vienen gratis.
export default function Modal({onClose, label, children}: {onClose: () => void; label: string; children: ReactNode}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      // Un clic sobre el propio <dialog> (no sobre su contenido) es un clic en el backdrop.
      onClick={e => e.target === e.currentTarget && onClose()}
      className="m-auto w-213 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[5px] bg-white text-ink shadow-[0_3px_6.3px_5px_rgba(0,0,0,0.04)] backdrop:bg-black/40">
      {children}
    </dialog>
  );
}

// Franja inferior con las acciones, igual en los dos popups del diseño.
export const ModalFooter = ({children}: {children: ReactNode}) => (
  <div className="flex items-center justify-end gap-3 border-t border-ink/25 bg-peach/4 px-8 pt-8 pb-8">{children}</div>
);
