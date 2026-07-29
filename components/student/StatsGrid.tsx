import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-5">
        <div className="flex justify-between items-center">
          {icon}
          <span className="text-2xl font-bold">
            {value}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          {title}
        </p>
      </CardContent>
    </Card>
  );
}

