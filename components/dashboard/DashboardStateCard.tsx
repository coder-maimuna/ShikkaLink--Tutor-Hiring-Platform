import { Card, CardContent } from '@/components/ui/card';

interface DashboardStateCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
}

export default function DashboardStateCard({ title, value, description, icon }: DashboardStateCardProps) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
          </div>
          {icon ? <div className="rounded-lg bg-green-50 p-2 text-green-700">{icon}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
