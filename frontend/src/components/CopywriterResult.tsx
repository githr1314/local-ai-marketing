import { useState } from 'react'
import { Button, Spin } from 'antd'

interface Props {
  content: string
  isGenerating: boolean
  isFavorited: boolean
  onRegenerate: () => void
  onFavorite: () => void
}

export default function CopywriterResult({
  content,
  isGenerating,
  isFavorited,
  onRegenerate,
  onFavorite,
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      // iOS Safari 降级方案：展示选中框手动复制
      const textarea = document.createElement('textarea')
      textarea.value = content
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!content && !isGenerating) return null

  return (
    <div className="result-container">
      <div className="result-header">
        <span className="result-label">✦ 生成结果</span>
      </div>

      <div className="result-text-area">
        {isGenerating && !content ? (
          <div className="result-loading">
            <Spin size="small" />
            <span className="result-loading-text">AI 正在创作中...</span>
          </div>
        ) : (
          <div className="result-text">
            <pre>{content}</pre>
            {isGenerating && <span className="typing-cursor">▋</span>}
          </div>
        )}
      </div>

      {!isGenerating && content && (
        <div className="action-bar">
          <Button
            type="primary"
            onClick={handleCopy}
            className={copied ? 'action-bar__btn--copied' : ''}
          >
            {copied ? '✓ 已复制' : '📋 一键复制'}
          </Button>

          <Button onClick={onRegenerate}>
            🔄 重新生成
          </Button>

          <Button
            onClick={onFavorite}
            className={isFavorited ? 'action-bar__btn--favorited' : ''}
          >
            {isFavorited ? '⭐ 已收藏' : '☆ 收藏'}
          </Button>
        </div>
      )}
    </div>
  )
}
