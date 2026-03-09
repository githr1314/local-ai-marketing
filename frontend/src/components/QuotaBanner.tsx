import { Button } from 'antd'

interface Props {
  remaining: number
  isPaid: boolean
  limit: number
  onUpgrade: () => void
}

export default function QuotaBanner({ remaining, isPaid, limit, onUpgrade }: Props) {
  if (isPaid) return null

  const isLow = remaining <= 1
  const isEmpty = remaining === 0

  return (
    <div className={`quota-banner ${isLow ? 'quota-banner--low' : ''}`}>
      <span className="quota-banner__text">
        今日剩余：<strong>{remaining}</strong> / {limit} 次
      </span>
      {isLow && !isEmpty && (
        <Button size="small" type="primary" onClick={onUpgrade} className="quota-banner__btn">
          升级会员，无限生成
        </Button>
      )}
      {isEmpty && (
        <Button size="small" type="primary" danger onClick={onUpgrade} className="quota-banner__btn">
          次数已用完，立即升级
        </Button>
      )}
    </div>
  )
}
