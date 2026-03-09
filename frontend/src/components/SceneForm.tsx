import { Form, Input, Radio, Button } from 'antd'
import type { Scene, CopyStyle, Platform } from '../types'

interface FormValues {
  storeName: string
  activityContent?: string
  discount?: string
  activityTime?: string
  address?: string
  style: CopyStyle
  platform: Platform
}

interface Props {
  scene: Scene
  onSubmit: (values: FormValues) => void
  isGenerating: boolean
  isQuotaEmpty: boolean
  onUpgrade: () => void
}

const STYLE_OPTIONS: { label: string; value: CopyStyle }[] = [
  { label: '接地气口语', value: 'casual' },
  { label: '高级氛围感', value: 'premium' },
  { label: '促销紧迫感', value: 'urgent' },
  { label: '干货科普', value: 'educational' },
]

const PLATFORM_OPTIONS: { label: string; value: Platform }[] = [
  { label: '朋友圈', value: 'wechat' },
  { label: '小红书', value: 'xiaohongshu' },
  { label: '抖音', value: 'douyin' },
  { label: '社群', value: 'group' },
]

export default function SceneForm({ scene, onSubmit, isGenerating, isQuotaEmpty, onUpgrade }: Props) {
  const [form] = Form.useForm<FormValues>()

  return (
    <div className="scene-form-wrapper">
      <div className="scene-form-header">
        <span className="scene-form-icon">{scene.icon}</span>
        <span className="scene-form-title">{scene.name}</span>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ style: 'casual', platform: 'wechat' }}
        className="scene-form"
      >
        <Form.Item
          label="门店名称"
          name="storeName"
          rules={[{ required: true, message: '请输入门店名称' }]}
        >
          <Input
            placeholder="如：老王麻辣烫"
            maxLength={20}
            showCount
            style={{ fontSize: 16 }}
          />
        </Form.Item>

        <Form.Item label="活动内容" name="activityContent">
          <Input.TextArea
            placeholder="如：新品上市、周年庆活动"
            maxLength={100}
            showCount
            rows={2}
            style={{ fontSize: 16 }}
          />
        </Form.Item>

        <Form.Item label="优惠力度" name="discount">
          <Input placeholder="如：全场8折、买一送一" style={{ fontSize: 16 }} />
        </Form.Item>

        <Form.Item label="活动时间" name="activityTime">
          <Input placeholder="如：3月1日-3月15日" style={{ fontSize: 16 }} />
        </Form.Item>

        <Form.Item label="门店地址" name="address">
          <Input placeholder="如：XX街道XX号（选填）" style={{ fontSize: 16 }} />
        </Form.Item>

        <Form.Item label="文案风格" name="style">
          <Radio.Group options={STYLE_OPTIONS} optionType="button" buttonStyle="solid" />
        </Form.Item>

        <Form.Item label="适配平台" name="platform">
          <Radio.Group options={PLATFORM_OPTIONS} optionType="button" buttonStyle="solid" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          {isQuotaEmpty ? (
            <Button type="primary" block size="large" danger onClick={onUpgrade}>
              升级解锁，无限生成
            </Button>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isGenerating}
              disabled={isGenerating}
            >
              {isGenerating ? '生成中...' : '✨ 生成文案'}
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}
