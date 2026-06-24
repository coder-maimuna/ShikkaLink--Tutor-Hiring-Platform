
import { Progress } from "@/components/ui/progress";
export default function ProgressRow({
  subject,
  progress,
}: {
  subject: string;
  progress: number;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">
          {subject}
        </span>

        <span className="text-sm text-muted-foreground">
          {progress}%
        </span>
      </div>

      <Progress value={progress} />
    </div>
  );
}