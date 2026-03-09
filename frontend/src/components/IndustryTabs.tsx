import { Tabs } from 'antd'
import type { Industry } from '../types'
import { INDUSTRIES } from '../data/scenes'

interface Props {
  value: Industry
  onChange: (industry: Industry) => void
}

export default function IndustryTabs({ value, onChange }: Props) {
  return (
    <Tabs
      activeKey={value}
      onChange={key => onChange(key as Industry)}
      className="industry-tabs"
      items={INDUSTRIES.map(ind => ({
        key: ind.key,
        label: (
          <span className="industry-tab-label">
            <span className="industry-tab-icon">{ind.icon}</span>
            {ind.label}
          </span>
        ),
      }))}
    />
  )
}
