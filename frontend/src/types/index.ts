export type Industry = 'restaurant' | 'beauty' | 'education'

export type CopyStyle = 'casual' | 'premium' | 'urgent' | 'educational'

export type Platform = 'wechat' | 'xiaohongshu' | 'douyin' | 'group'

export interface Scene {
  id: string
  name: string
  icon: string
  industry: Industry
}

export interface GenerateParams {
  industry: Industry
  scene: Scene
  storeName: string
  activityContent?: string
  discount?: string
  activityTime?: string
  address?: string
  style: CopyStyle
  platform: Platform
}

export interface HistoryRecord {
  id: string
  industry: Industry
  scene: Scene
  params: GenerateParams
  content: string
  createdAt: number
  favorited: boolean
}
