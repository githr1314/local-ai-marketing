import { useState, useEffect } from 'react'
import type { HistoryRecord } from '../types'

const FREE_MAX_HISTORY = 20
const FREE_MAX_FAVORITES = 10
const STORAGE_KEY = 'copywriter_history'

export function useHistory(isPaid: boolean) {
  const [history, setHistory] = useState<HistoryRecord[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {
        // ignore corrupt data
      }
    }
  }, [])

  const persist = (records: HistoryRecord[]) => {
    setHistory(records)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  const addRecord = (record: Omit<HistoryRecord, 'id' | 'createdAt' | 'favorited'>): HistoryRecord => {
    const newRecord: HistoryRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: Date.now(),
      favorited: false,
    }
    const maxHistory = isPaid ? Infinity : FREE_MAX_HISTORY
    const updated = [newRecord, ...history].slice(0, maxHistory)
    persist(updated)
    return newRecord
  }

  /** 切换收藏状态，返回 false 表示超出免费上限 */
  const toggleFavorite = (id: string): boolean => {
    const record = history.find(r => r.id === id)
    if (!record) return false
    if (!record.favorited && !isPaid) {
      const favoriteCount = history.filter(r => r.favorited).length
      if (favoriteCount >= FREE_MAX_FAVORITES) return false
    }
    const updated = history.map(r => r.id === id ? { ...r, favorited: !r.favorited } : r)
    persist(updated)
    return true
  }

  const deleteRecord = (id: string) => {
    persist(history.filter(r => r.id !== id))
  }

  const favorites = history.filter(r => r.favorited)

  return { history, favorites, addRecord, toggleFavorite, deleteRecord }
}
