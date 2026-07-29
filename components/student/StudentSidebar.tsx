export default function SidebarItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
        active
          ? "bg-green-50 text-green-700 font-medium"
          : "hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}
