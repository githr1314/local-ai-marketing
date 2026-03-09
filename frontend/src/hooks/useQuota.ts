import { useState, useEffect } from 'react'

const FREE_DAILY_LIMIT = 5
const STORAGE_KEY_DATE = 'quota_date'
const STORAGE_KEY_COUNT = 'quota_count'

// TODO: 接入后端用户认证后替换此变量
const IS_PAID_USER = false

export function useQuota() {
  const [remaining, setRemaining] = useState(FREE_DAILY_LIMIT)
  const [isPaid] = useState(IS_PAID_USER)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE)
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_KEY_DATE, today)
      localStorage.setItem(STORAGE_KEY_COUNT, '0')
      setRemaining(FREE_DAILY_LIMIT)
    } else {
      const used = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10)
      setRemaining(Math.max(0, FREE_DAILY_LIMIT - used))
    }
  }, [])

  /** 消耗一次配额，返回是否成功 */
  const consume = (): boolean => {
    if (isPaid) return true
    if (remaining <= 0) return false
    const used = parseInt(localStorage.getItem(STORAGE_KEY_COUNT) || '0', 10)
    localStorage.setItem(STORAGE_KEY_COUNT, String(used + 1))
    setRemaining(prev => prev - 1)
    return true
  }

  return { remaining, isPaid, consume, limit: FREE_DAILY_LIMIT }
}
