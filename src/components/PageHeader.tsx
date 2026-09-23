import type {ReactNode} from 'react';

export default function PageHeader({title, subtitle, action}: {title: string; subtitle: string; action?: ReactNode}) {
  return (
    <header className="flex items-center justify-between gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-[32px] leading-tight font-semibold text-muted">{title}</h1>
        <p className="text-base">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}
