export type GrowthStage = 'egg' | 'chick' | 'juvenile' | 'subadult' | 'adult'

export type Weather = 'sunny' | 'rainy' | 'snowy' | 'stormy'

export type Personality = 'bold' | 'shy' | 'gentle' | 'curious' | 'stubborn'

export type BerryType = 'red' | 'blue' | 'golden'

export type GamePhase = 'start' | 'playing' | 'breeding' | 'ended'

export type RareResourceType = 'feather' | 'crystal' | 'herb' | 'pearl' | 'starstone'

export type ExpeditionDistance = 'near' | 'medium' | 'far' | 'extreme'

export type ExpeditionStatus = 'preparing' | 'traveling' | 'returning' | 'completed' | 'failed'

export interface RareResource {
  id: string
  type: RareResourceType
  amount: number
  rarity: number
}

export interface Expedition {
  id: string
  birdIds: string[]
  distance: ExpeditionDistance
  status: ExpeditionStatus
  startTime: number
  duration: number
  returnTime: number
  progress: number
  riskLevel: number
  weatherEncountered: Weather[]
  currentWeather: Weather
  rewards: RareResource[]
  healthLoss: number
  success: boolean
  resultMessage?: string
}

export interface ExpeditionSeason {
  isActive: boolean
  seasonDay: number
  totalExpeditions: number
  successfulExpeditions: number
  resourcesCollected: RareResource[]
  seasonEndDay: number
}

export interface Bird {
  id: string
  name: string
  stage: GrowthStage
  stageProgress: number
  hunger: number
  fear: number
  health: number
  personality: Personality
  hatchDuration: number
  hatchTimeLeft: number
  isAway: boolean
  isSick: boolean
  isDead: boolean
  feedingCount: number
  lastFedAt: number
  awayUntil?: number
  sickUntil?: number
  justHatched?: boolean
  justGrew?: boolean
  justFed?: boolean
  isOnExpedition?: boolean
  expeditionId?: string
  expeditionCount?: number
  successfulExpeditions?: number
}

export interface Berry {
  id: string
  x: number
  y: number
  value: number
  type: BerryType
  spawnedAt: number
}

export interface GameState {
  phase: GamePhase
  day: number
  dayProgress: number
  currentWeather: Weather
  nextWeatherChangeAt: number
  foodStock: number
  birds: Bird[]
  berries: Berry[]
  totalHatched: number
  totalDied: number
  breedingCount: number
  maxBreedingRounds: number
  eventLog: { id: string; message: string; type: string; timestamp: number }[]
  score?: GameScore
  selectedBirdId?: string
  expeditionSeason: ExpeditionSeason
  expeditions: Expedition[]
  rareResources: RareResource[]
  selectedExpeditionBirdIds: string[]
  showExpeditionPanel: boolean
}

export interface GameScore {
  totalScore: number
  survivalRate: number
  avgHealth: number
  breedingBonus: number
  personalityBonus: number
  stars: number
  rank: string
}

export interface WeatherEffect {
  hungerMod: number
  fearMod: number
  healthMod: number
  awayChance?: number
  sickChance?: number
}
