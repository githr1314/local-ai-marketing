import type { Industry, Scene } from '../types'

export const INDUSTRIES: { key: Industry; label: string; icon: string }[] = [
  { key: 'restaurant', label: '餐饮', icon: '🍜' },
  { key: 'beauty', label: '美业', icon: '💅' },
  { key: 'education', label: '教培', icon: '📚' },
]

export const INDUSTRY_LABELS: Record<Industry, string> = {
  restaurant: '餐饮',
  beauty: '美业',
  education: '教培',
}

export const SCENES: Scene[] = [
  // 餐饮
  { id: 'restaurant-promo', name: '朋友圈日常种草', icon: '📢', industry: 'restaurant' },
  { id: 'restaurant-new', name: '新品上市', icon: '🆕', industry: 'restaurant' },
  { id: 'restaurant-discount', name: '限时折扣', icon: '🏷️', industry: 'restaurant' },
  { id: 'restaurant-festival', name: '节日活动', icon: '🎉', industry: 'restaurant' },
  { id: 'restaurant-member', name: '会员招募', icon: '👑', industry: 'restaurant' },
  { id: 'restaurant-event', name: '门店活动', icon: '🎊', industry: 'restaurant' },
  { id: 'restaurant-takeout', name: '外卖推广', icon: '🛵', industry: 'restaurant' },
  { id: 'restaurant-review', name: '好评返现', icon: '⭐', industry: 'restaurant' },
  // 美业
  { id: 'beauty-new', name: '新品推介', icon: '✨', industry: 'beauty' },
  { id: 'beauty-promo', name: '朋友圈种草', icon: '📸', industry: 'beauty' },
  { id: 'beauty-discount', name: '限时优惠', icon: '🏷️', industry: 'beauty' },
  { id: 'beauty-member', name: '会员招募', icon: '👑', industry: 'beauty' },
  { id: 'beauty-festival', name: '节日活动', icon: '🎁', industry: 'beauty' },
  { id: 'beauty-tutorial', name: '护肤攻略', icon: '💆', industry: 'beauty' },
  { id: 'beauty-before-after', name: '效果展示', icon: '🌟', industry: 'beauty' },
  { id: 'beauty-referral', name: '老带新优惠', icon: '🤝', industry: 'beauty' },
  // 教培
  { id: 'edu-enroll', name: '招生报名', icon: '📝', industry: 'education' },
  { id: 'edu-trial', name: '试听邀约', icon: '🎧', industry: 'education' },
  { id: 'edu-result', name: '成果展示', icon: '🏆', industry: 'education' },
  { id: 'edu-discount', name: '限时优惠', icon: '🎫', industry: 'education' },
  { id: 'edu-festival', name: '节日活动', icon: '🎊', industry: 'education' },
  { id: 'edu-tips', name: '学习干货', icon: '💡', industry: 'education' },
  { id: 'edu-review', name: '学员好评', icon: '⭐', industry: 'education' },
  { id: 'edu-open-class', name: '公开课预告', icon: '📣', industry: 'education' },
]

export function getScenesByIndustry(industry: Industry): Scene[] {
  return SCENES.filter(s => s.industry === industry)
}
