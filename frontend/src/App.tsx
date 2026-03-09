import { useState, useRef, useCallback } from 'react'
import { App as AntdApp } from 'antd'
import type { Industry, Scene, GenerateParams } from './types'
import { useQuota } from './hooks/useQuota'
import { useHistory } from './hooks/useHistory'
import { generateCopywriter } from './api/copywriter'
import QuotaBanner from './components/QuotaBanner'
import UpgradeModal from './components/UpgradeModal'
import IndustryTabs from './components/IndustryTabs'
import SceneGrid from './components/SceneGrid'
import SceneForm from './components/SceneForm'
import CopywriterResult from './components/CopywriterResult'
import HistoryList from './components/HistoryList'

const TIMEOUT_MS = 15_000

function CopywriterApp() {
  const { message } = AntdApp.useApp()
  const { remaining, isPaid, consume, limit } = useQuota()
  const { history, favorites, addRecord, toggleFavorite, deleteRecord } = useHistory(isPaid)

  const [industry, setIndustry] = useState<Industry>('restaurant')
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [result, setResult] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const lastParamsRef = useRef<GenerateParams | null>(null)

  const handleSceneSelect = (scene: Scene) => {
    if (!isPaid && remaining <= 0) {
      setShowUpgrade(true)
      return
    }
    setSelectedScene(scene)
    setResult('')
    setCurrentRecordId(null)
  }

  const handleIndustryChange = (newIndustry: Industry) => {
    setIndustry(newIndustry)
    setSelectedScene(null)
    setResult('')
    setCurrentRecordId(null)
  }

  const runGenerate = useCallback(async (params: GenerateParams, isRegen = false) => {
    if (!isRegen) {
      const ok = consume()
      if (!ok) {
        setShowUpgrade(true)
        return
      }
    }

    // Cancel previous generation
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setResult('')
    setIsGenerating(true)
    setCurrentRecordId(null)

    const timeoutId = setTimeout(() => {
      controller.abort()
      setIsGenerating(false)
      message.error('生成超时，请重试')
    }, TIMEOUT_MS)

    try {
      let accumulated = ''
      for await (const chunk of generateCopywriter(params, controller.signal)) {
        accumulated += chunk
        setResult(accumulated)
      }

      if (!controller.signal.aborted) {
        clearTimeout(timeoutId)
        setIsGenerating(false)
        if (!isRegen) {
          const record = addRecord({
            industry: params.industry,
            scene: params.scene,
            params,
            content: accumulated,
          })
          setCurrentRecordId(record.id)
        } else {
          setCurrentRecordId(null)
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        clearTimeout(timeoutId)
        setIsGenerating(false)
        message.error('生成失败，请重试')
      }
    }
  }, [consume, addRecord, message])

  const handleFormSubmit = (values: Omit<GenerateParams, 'industry' | 'scene'>) => {
    if (!selectedScene) return
    const params: GenerateParams = {
      ...values,
      industry,
      scene: selectedScene,
    }
    lastParamsRef.current = params
    runGenerate(params, false)
  }

  const handleRegenerate = () => {
    if (lastParamsRef.current) {
      runGenerate(lastParamsRef.current, true)
    }
  }

  const handleFavorite = () => {
    if (!currentRecordId) return
    const ok = toggleFavorite(currentRecordId)
    if (!ok) {
      message.warning('免费版收藏上限 10 条，升级会员可无限收藏')
    }
  }

  const currentRecord = currentRecordId ? history.find((r: { id: string }) => r.id === currentRecordId) : null
  const isFavorited = currentRecord?.favorited ?? false

  return (
    <div className="app-wrapper">
      {/* 顶部导航 */}
      <header className="app-header">
        <div className="app-header__left">
          <h1 className="app-title">✍️ AI 营销文案助手</h1>
          <span className="app-subtitle">本地商家私域运营利器</span>
        </div>
        <div className="app-header__right">
          <button className="header-btn" onClick={() => setShowHistory(true)}>
            📂 我的文案
          </button>
          <QuotaBanner
            remaining={remaining}
            isPaid={isPaid}
            limit={limit}
            onUpgrade={() => setShowUpgrade(true)}
          />
        </div>
      </header>

      {/* 主内容区 */}
      <main className="app-main">
        {/* 左侧：行业 + 场景 */}
        <div className="panel panel--left">
          <IndustryTabs value={industry} onChange={handleIndustryChange} />
          <SceneGrid
            industry={industry}
            selectedScene={selectedScene}
            onSelect={handleSceneSelect}
          />
        </div>

        {/* 右侧：表单 + 结果 */}
        <div className={`panel panel--right ${!selectedScene ? 'panel--right-empty' : ''}`}>
          {!selectedScene ? (
            <div className="empty-hint">
              <span className="empty-hint__icon">👈</span>
              <p>请从左侧选择一个场景开始</p>
            </div>
          ) : (
            <>
              <SceneForm
                scene={selectedScene}
                onSubmit={handleFormSubmit}
                isGenerating={isGenerating}
                isQuotaEmpty={!isPaid && remaining <= 0}
                onUpgrade={() => setShowUpgrade(true)}
              />
              <CopywriterResult
                content={result}
                isGenerating={isGenerating}
                isFavorited={isFavorited}
                onRegenerate={handleRegenerate}
                onFavorite={handleFavorite}
              />
            </>
          )}
        </div>
      </main>

      {/* 弹窗 & 抽屉 */}
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <HistoryList
        open={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteRecord}
        isPaid={isPaid}
      />
    </div>
  )
}

export default function App() {
  return (
    <AntdApp>
      <CopywriterApp />
    </AntdApp>
  )
}
