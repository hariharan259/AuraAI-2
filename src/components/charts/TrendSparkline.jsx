import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts'

export default function TrendSparkline({ data, dataKey, color }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
