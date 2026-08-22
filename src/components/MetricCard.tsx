import type { ReactNode } from 'react'

type Props = {
  label: string
  value: string
  helper?: string
  icon: ReactNode
}

export function MetricCard({ label, value, helper, icon }: Props) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div>
        <span className="metric-label">{label}</span>
        <strong>{value}</strong>
        {helper && <small>{helper}</small>}
      </div>
    </div>
  )
}
