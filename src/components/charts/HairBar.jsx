import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

export default function HairBar({ data }) {
  const chartData = [
    { name: 'Hair Fall', score: data.hairFallScore },
    { name: 'Density', score: data.densityScore },
    { name: 'Damage', score: data.damageScore },
    { name: 'Scalp', score: data.scalpHealthScore },
  ]

  const getColor = (score) => {
    if (score >= 80) return 'var(--aura-green)'
    if (score >= 65) return 'var(--aura-cyan)'
    if (score >= 50) return 'var(--aura-gold)'
    return 'var(--aura-orange)'
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} />
        <Tooltip cursor={{ fill: 'var(--glass-bg-hover)' }} contentStyle={{ backgroundColor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} />
        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
