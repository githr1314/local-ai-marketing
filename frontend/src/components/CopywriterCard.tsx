import { useState } from 'react'
import { Button } from 'antd'
import type { HistoryRecord } from '../types'
import { INDUSTRY_LABELS } from '../data/scenes'

interface Props {
  record: HistoryRecord
  onCopy: (content: string) => void
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export default function CopywriterCard({ record, onCopy, onToggleFavorite, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(record.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const preview = record.content.slice(0, 50) + (record.content.length > 50 ? '...' : '')
  const date = new Date(record.createdAt).toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="copywriter-card">
      <div className="copywriter-card__meta">
        <span className="copywriter-card__tag">{INDUSTRY_LABELS[record.industry]}</span>
        <span className="copywriter-card__tag copywriter-card__tag--scene">
          {record.scene.icon} {record.scene.name}
        </span>
        <span className="copywriter-card__date">{date}</span>
      </div>

      <div
        className="copywriter-card__content"
        onClick={() => setExpanded(e => !e)}
      >
        <pre className={expanded ? '' : 'copywriter-card__content--collapsed'}>
          {expanded ? record.content : preview}
        </pre>
        <span className="copywriter-card__expand-hint">
          {expanded ? '收起 ▲' : '展开查看 ▼'}
        </span>
      </div>

      <div className="copywriter-card__actions">
        <Button size="small" onClick={handleCopy}>
          {copied ? '✓ 已复制' : '复制'}
        </Button>
        <Button
          size="small"
          onClick={() => onToggleFavorite(record.id)}
          className={record.favorited ? 'btn--favorited' : ''}
        >
          {record.favorited ? '⭐ 已收藏' : '☆ 收藏'}
        </Button>
        <Button size="small" danger onClick={() => onDelete(record.id)}>
          删除
        </Button>
      </div>
    </div>
  )
}
