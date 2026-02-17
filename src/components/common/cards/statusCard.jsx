export default function StatusCard({ title, value, color }) {
  return (
    <div className="bg-slate-100 rounded-xl p-2">
      <p className="text-center text-gray-500 text-sm capitalize pb-2"> {title}</p>
      <div className={`text-${color} font-bold text-center text-lg`}>
        {value}
      </div>
    </div>
  );
}
