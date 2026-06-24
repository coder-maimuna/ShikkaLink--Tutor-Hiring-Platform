import { Button } from "@/components/ui/button";

export default function SessionRow({
  subject,
  tutor,
  time,
}: {
  subject: string;
  tutor: string;
  time: string;
}) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <h4 className="font-medium">{subject}</h4>

        <p className="text-sm text-muted-foreground">
          {tutor}
        </p>

        <p className="text-xs mt-1">{time}</p>
      </div>

      <Button size="sm">Join</Button>
    </div>
  );
}
