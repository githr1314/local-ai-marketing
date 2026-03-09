import type { Scene, Industry } from '../types'
import { getScenesByIndustry } from '../data/scenes'

interface Props {
  industry: Industry
  selectedScene: Scene | null
  onSelect: (scene: Scene) => void
}

export default function SceneGrid({ industry, selectedScene, onSelect }: Props) {
  const scenes = getScenesByIndustry(industry)

  return (
    <div className="scene-grid">
      {scenes.map(scene => (
        <div
          key={scene.id}
          className={`scene-card ${selectedScene?.id === scene.id ? 'scene-card--active' : ''}`}
          onClick={() => onSelect(scene)}
        >
          <span className="scene-card__icon">{scene.icon}</span>
          <span className="scene-card__name">{scene.name}</span>
        </div>
      ))}
    </div>
  )
}
