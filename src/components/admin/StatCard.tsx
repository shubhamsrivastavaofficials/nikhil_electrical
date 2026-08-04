import { LucideIcon } from 'lucide-react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'volt',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: 'volt' | 'copper' | 'amber';
}) {
  const accentClasses = {
    volt: 'bg-volt-500/10 text-volt-400 ring-volt-500/20',
    copper: 'bg-copper-500/10 text-copper-400 ring-copper-500/20',
    amber: 'bg-safety-amber/10 text-safety-amber ring-safety-amber/20',
  }[accent];

  return (
    <div className="rounded-2xl border border-white/5 bg-base-800 p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ${accentClasses}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 font-display text-2xl font-bold text-ink-100">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </div>
  );
}
