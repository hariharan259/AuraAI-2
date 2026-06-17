import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function ForecastLine({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
        <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis domain={['auto', 'auto']} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--text-primary)' }}
        />
        <Line type="monotone" dataKey="skin" stroke="var(--aura-green)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Skin" />
        <Line type="monotone" dataKey="hair" stroke="var(--aura-cyan)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Hair" />
        <Line type="monotone" dataKey="overall" stroke="var(--aura-primary)" strokeWidth={4} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Overall" />
      </LineChart>
    </ResponsiveContainer>
  )
}
