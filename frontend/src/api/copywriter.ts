import type { GenerateParams, CopyStyle, Platform, Industry } from '../types'

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const PLATFORM_TAGS: Record<Platform, (storeName: string, industryLabel: string) => string> = {
  wechat: () => '',
  xiaohongshu: (store, ind) => `\n\n#${store} #${ind}推荐 #本地生活 #同城打卡`,
  douyin: (store, ind) => `\n\n#${ind} #本地探店 #${store} #推荐`,
  group: () => '',
}

const INDUSTRY_LABELS: Record<Industry, string> = {
  restaurant: '美食',
  beauty: '美业',
  education: '教育',
}

function buildMockContent(params: GenerateParams): string {
  const {
    storeName,
    activityContent,
    discount,
    activityTime,
    style,
    platform,
    industry,
  } = params

  const store = storeName || '我们店'
  const activity = activityContent || '特惠活动'
  const price = discount || '超值优惠'
  const timeStr = activityTime ? `\n\n⏰ 活动时间：${activityTime}` : ''
  const tags = PLATFORM_TAGS[platform](store, INDUSTRY_LABELS[industry])

  const templates: Record<CopyStyle, string> = {
    casual:
      `【${store}来新活动啦！】\n\n` +
      `${activity}，${price}！\n\n` +
      `这次真的不要错过，机会难得～ 老顾客都说好，快来体验吧！` +
      timeStr +
      `\n\n快来${store}打卡，期待和你相见！🎉` +
      tags,

    premium:
      `📍 ${store}\n\n` +
      `${activity}\n\n` +
      `精心甄选，匠心呈现。${price}，只为给您最优质的体验。` +
      timeStr +
      `\n\n欢迎莅临，期待您的到来。` +
      tags,

    urgent:
      `⚡ 限时限量！${store}${activity}！\n\n` +
      `${price}，仅此一次！` +
      (activityTime ? `\n\n⏰ ${activityTime}，截止不候！` : '\n\n⚠️ 活动名额有限，先到先得！') +
      `\n\n手慢无！立即行动，不要错过！🔥` +
      tags,

    educational:
      `【干货分享】${store}为您解析\n\n` +
      `${activity} —— ${price}\n\n` +
      `💡 专业知识分享：\n` +
      `• 科学方法，效果更佳\n` +
      `• 专业团队，品质保障\n` +
      `• 口碑认证，放心选择` +
      timeStr +
      `\n\n欢迎咨询了解更多～` +
      tags,
  }

  return templates[style]
}

/**
 * 流式生成文案（Mock 版本，模拟 SSE 打字机效果）
 *
 * TODO: 接入真实后端时，替换为：
 *   const response = await fetch('/api/copywriter/generate', { method: 'POST', body: JSON.stringify(params), signal })
 *   const reader = response.body!.getReader()
 *   // 逐块读取并 yield
 */
export async function* generateCopywriter(
  params: GenerateParams,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const content = buildMockContent(params)

  for (const char of content) {
    if (signal?.aborted) return
    // 模拟不均匀的打字速度，更自然
    await delay(20 + Math.random() * 30)
    yield char
  }
}
