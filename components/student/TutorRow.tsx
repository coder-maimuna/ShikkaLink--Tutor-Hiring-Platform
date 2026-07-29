export default function TutorRow({
  name,
  subject,
  rating,
}: {
  name: string;
  subject: string;
  rating: string;
}) {
  return (
    <div className="flex items-center justify-between border rounded-xl p-4">
      <div className="flex gap-3 items-center">
        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center font-semibold text-green-700">
          {name[0]}
        </div>

        <div>
          <h4 className="font-medium">{name}</h4>

          <p className="text-sm text-muted-foreground">
            {subject}
          </p>
        </div>
      </div>

      <span className="font-medium">
        ⭐ {rating}
      </span>
    </div>
  );
}
