import { Modal, Button } from 'antd'

interface Props {
  open: boolean
  onClose: () => void
}

const FEATURES = [
  { name: '每日文案生成', free: '5 次', paid: '无限次' },
  { name: '历史记录保存', free: '20 条', paid: '无限' },
  { name: '文案收藏', free: '10 条', paid: '无限' },
  { name: '行业场景模板', free: '全部', paid: '全部 + 新场景优先' },
  { name: '平台适配', free: '全部', paid: '全部' },
  { name: '重新生成', free: '不限次', paid: '不限次' },
]

export default function UpgradeModal({ open, onClose }: Props) {
  return (
    <Modal
      title="🚀 升级会员，解锁无限生成"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={480}
    >
      <p style={{ color: '#666', marginBottom: 20 }}>
        升级后立即享受以下权益对比：
      </p>

      <table className="upgrade-table">
        <thead>
          <tr>
            <th>功能</th>
            <th>免费版</th>
            <th className="upgrade-table__paid-col">付费版 ✨</th>
          </tr>
        </thead>
        <tbody>
          {FEATURES.map(row => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td className="upgrade-table__free-val">{row.free}</td>
              <td className="upgrade-table__paid-val">{row.paid}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <Button type="primary" size="large" block style={{ height: 48, fontSize: 16 }}>
          立即升级会员
        </Button>
        <p style={{ fontSize: 12, color: '#aaa', marginTop: 10 }}>
          TODO: 接入支付宝 / 微信支付
        </p>
      </div>
    </Modal>
  )
}
