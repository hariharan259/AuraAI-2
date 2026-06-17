import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'

export default function SkinRadar({ data }) {
  const chartData = [
    { subject: 'Acne', score: data.acneScore },
    { subject: 'Pigmentation', score: data.pigmentationScore },
    { subject: 'Redness', score: data.rednessScore },
    { subject: 'Oiliness', score: data.oilinessScore },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        <PolarGrid stroke="var(--glass-border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Skin Metrics" dataKey="score" stroke="var(--aura-primary)" fill="var(--aura-primary-glow)" fillOpacity={0.6} />
        <Tooltip contentStyle={{ backgroundColor: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: '8px' }} itemStyle={{ color: 'var(--aura-primary-light)' }} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
