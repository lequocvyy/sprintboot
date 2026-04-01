type Props = {
  title: string;
  value: number | string;
};

export default function OverviewCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
}