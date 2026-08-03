interface SlotCardProps {
  slots: Array<{
    slot_id?: number;
    day_of_week?: string;
    time_slot?: string;
    subject?: string;
  }>;
}

export default function SlotCard({ slots }: SlotCardProps) {
  const grouped = slots.reduce<Record<string, typeof slots>>((acc, slot) => {
    const day = slot.day_of_week || 'Other';
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  const days = Object.keys(grouped);

  if (days.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div key={day}>
          <p className="mb-2 text-sm font-semibold text-[#2D7A3A]">{day}</p>
          <div className="flex flex-wrap gap-2">
            {grouped[day].map((slot) => (
              <span
                key={slot.slot_id ?? `${day}-${slot.time_slot}-${slot.subject}`}
                className="inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#2D7A3A] shadow-sm"
              >
                {slot.time_slot}
                {slot.subject ? ` · ${slot.subject}` : ''}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
