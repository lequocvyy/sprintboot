import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { PackageSalesItemResponse } from "../api/dashboardApi";

type Props = {
  data: PackageSalesItemResponse[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

export default function PackagePieChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="soldCount"
            nameKey="packageCode"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}