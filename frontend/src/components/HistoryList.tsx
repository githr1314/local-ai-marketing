import { useState } from 'react'
import { Drawer, Tabs, Empty, Modal, message } from 'antd'
import type { HistoryRecord } from '../types'
import CopywriterCard from './CopywriterCard'

interface Props {
  open: boolean
  onClose: () => void
  history: HistoryRecord[]
  favorites: HistoryRecord[]
  onToggleFavorite: (id: string) => boolean
  onDelete: (id: string) => void
  isPaid: boolean
}

export default function HistoryList({
  open,
  onClose,
  history,
  favorites,
  onToggleFavorite,
  onDelete,
  isPaid,
}: Props) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    message.success('已复制到剪贴板')
  }

  const handleToggleFavorite = (id: string) => {
    const ok = onToggleFavorite(id)
    if (!ok) {
      message.warning(`免费版最多收藏 10 条，升级会员可无限收藏`)
    }
  }

  const confirmDelete = (id: string) => setDeleteTarget(id)

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget)
      setDeleteTarget(null)
    }
  }

  const renderList = (records: HistoryRecord[]) => {
    if (records.length === 0) {
      return <Empty description="暂无记录" style={{ marginTop: 60 }} />
    }
    return (
      <div className="history-list">
        {records.map(record => (
          <CopywriterCard
            key={record.id}
            record={record}
            onCopy={handleCopy}
            onToggleFavorite={handleToggleFavorite}
            onDelete={confirmDelete}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Drawer
        title="我的文案"
        placement="right"
        width={480}
        open={open}
        onClose={onClose}
        className="history-drawer"
      >
        {!isPaid && (
          <p className="history-drawer__limit-tip">
            免费版保留最近 20 条历史 / 收藏上限 10 条
          </p>
        )}
        <Tabs
          items={[
            {
              key: 'history',
              label: `历史记录（${history.length}）`,
              children: renderList(history),
            },
            {
              key: 'favorites',
              label: `我的收藏（${favorites.length}）`,
              children: renderList(favorites),
            },
          ]}
        />
      </Drawer>

      <Modal
        title="确认删除"
        open={deleteTarget !== null}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        okText="删除"
        okButtonProps={{ danger: true }}
        cancelText="取消"
        centered
      >
        <p>确定要删除这条文案记录吗？</p>
      </Modal>
    </>
  )
}
