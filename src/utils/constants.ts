import type { Weather, WeatherEffect, BerryType, GrowthStage, Personality, RareResourceType, ExpeditionDistance } from '@/types/game'

export const ATTR_MIN = 0
export const ATTR_MAX = 100
export const DEATH_THRESHOLD = 10

export const STAGE_DURATION: Record<Exclude<GrowthStage, 'adult'>, number> = {
  egg: 1,
  chick: 2,
  juvenile: 2,
  subadult: 1,
}

export const STAGE_NAMES: Record<GrowthStage, string> = {
  egg: '🥚 蛋',
  chick: '🐣 雏鸟',
  juvenile: '🐥 幼鸟',
  subadult: '🦜 亚成鸟',
  adult: '🐦 成鸟',
}

export const STAGE_EMOJI: Record<GrowthStage, string> = {
  egg: '🥚',
  chick: '🐣',
  juvenile: '🐥',
  subadult: '🦜',
  adult: '🐦',
}

export const FOOD_NEED_MULTIPLIER: Record<Exclude<GrowthStage, 'egg'>, number> = {
  chick: 1.5,
  juvenile: 1.2,
  subadult: 1.0,
  adult: 0.8,
}

export const HUNGER_DECAY_RATE = 1.5
export const FEAR_DECAY_RATE = 0.8
export const HEALTH_RECOVERY_RATE = 0.5

export const BERRY_SPAWN_INTERVAL = 4000
export const BERRY_MAX_COUNT = 8
export const BERRY_LIFETIME = 20000

export const BERRY_VALUES: Record<BerryType, number> = {
  red: 10,
  blue: 15,
  golden: 25,
}

export const BERRY_COLORS: Record<BerryType, string> = {
  red: '#C41E3A',
  blue: '#4169E1',
  golden: '#FFD700',
}

export const BERRY_EMOJI: Record<BerryType, string> = {
  red: '🍒',
  blue: '🫐',
  golden: '✨',
}

export const WEATHER_CHANGE_INTERVAL = 25000

export const WEATHER_EFFECTS: Record<Weather, WeatherEffect> = {
  sunny: { hungerMod: 1.0, fearMod: 0.8, healthMod: 1.0 },
  rainy: { hungerMod: 1.3, fearMod: 1.5, healthMod: 0.9, awayChance: 0.08 },
  snowy: { hungerMod: 1.5, fearMod: 1.2, healthMod: 0.7, sickChance: 0.12 },
  stormy: { hungerMod: 1.2, fearMod: 2.0, healthMod: 0.6, awayChance: 0.2, sickChance: 0.18 },
}

export const WEATHER_NAMES: Record<Weather, string> = {
  sunny: '☀️ 晴天',
  rainy: '🌧️ 雨天',
  snowy: '❄️ 雪天',
  stormy: '🌪️ 暴风',
}

export const WEATHER_COLORS: Record<Weather, string> = {
  sunny: 'from-amber-300/30 to-yellow-200/20',
  rainy: 'from-blue-400/40 to-gray-500/30',
  snowy: 'from-blue-100/40 to-white/30',
  stormy: 'from-gray-600/50 to-purple-800/40',
}

export const PERSONALITY_NAMES: Record<Personality, string> = {
  bold: '勇敢大胆',
  shy: '胆小害羞',
  gentle: '温柔恬静',
  curious: '好奇活泼',
  stubborn: '倔强独立',
}

export const PERSONALITY_EMOJI: Record<Personality, string> = {
  bold: '💪',
  shy: '🥺',
  gentle: '🌸',
  curious: '🌟',
  stubborn: '😤',
}

export const DAY_DURATION = 60000
export const INITIAL_FOOD = 30
export const MIN_EGGS = 2
export const MAX_EGGS = 4
export const MAX_BREEDING_ROUNDS = 2

export const BIRD_NAMES = [
  '毛毛', '豆豆', '啾啾', '喳喳', '花花', '点点', '果果', '泡泡',
  '糖糖', '圆圆', '小米', '小麦', '云朵', '星星', '月亮', '太阳',
  '小橘', '小蓝', '小绿', '小红', '阿黄', '阿白', '阿黑', '阿灰',
]

export const RARE_RESOURCE_NAMES: Record<RareResourceType, string> = {
  feather: '彩虹羽毛',
  crystal: '月光水晶',
  herb: '灵草',
  pearl: '深海珍珠',
  starstone: '星辰石',
}

export const RARE_RESOURCE_EMOJI: Record<RareResourceType, string> = {
  feather: '🪶',
  crystal: '💎',
  herb: '🌿',
  pearl: '🦪',
  starstone: '⭐',
}

export const RARE_RESOURCE_COLORS: Record<RareResourceType, string> = {
  feather: 'from-pink-400 to-purple-500',
  crystal: 'from-blue-400 to-cyan-300',
  herb: 'from-green-400 to-emerald-500',
  pearl: 'from-gray-200 to-blue-200',
  starstone: 'from-yellow-400 to-orange-500',
}

export const RARE_RESOURCE_RARITY: Record<RareResourceType, number> = {
  feather: 1,
  crystal: 2,
  herb: 1,
  pearl: 3,
  starstone: 4,
}

export const EXPEDITION_DISTANCE_NAMES: Record<ExpeditionDistance, string> = {
  near: '近郊探索',
  medium: '山谷远行',
  far: '跨海远征',
  extreme: '极限征途',
}

export const EXPEDITION_DISTANCE_DESC: Record<ExpeditionDistance, string> = {
  near: '风险较低，收获一般，适合新手队伍',
  medium: '中等风险，收益可观，需要一定经验',
  far: '高风险高回报，跨越海洋寻找珍稀宝物',
  extreme: '九死一生的极限征途，传说级宝藏在等待',
}

export const EXPEDITION_DURATION: Record<ExpeditionDistance, number> = {
  near: 30000,
  medium: 60000,
  far: 90000,
  extreme: 120000,
}

export const EXPEDITION_BASE_RISK: Record<ExpeditionDistance, number> = {
  near: 0.1,
  medium: 0.25,
  far: 0.45,
  extreme: 0.7,
}

export const EXPEDITION_REWARD_MULTIPLIER: Record<ExpeditionDistance, number> = {
  near: 1,
  medium: 2,
  far: 4,
  extreme: 8,
}

export const EXPEDITION_TEAM_SIZE = {
  min: 1,
  max: 4,
}

export const EXPEDITION_WEATHER_EFFECTS: Record<Weather, { riskMod: number; rewardMod: number; healthMod: number }> = {
  sunny: { riskMod: 0.8, rewardMod: 1.2, healthMod: 0.9 },
  rainy: { riskMod: 1.2, rewardMod: 0.9, healthMod: 1.3 },
  snowy: { riskMod: 1.5, rewardMod: 1.1, healthMod: 1.8 },
  stormy: { riskMod: 2.0, rewardMod: 0.7, healthMod: 2.5 },
}

export const EXPEDITION_SEASON_DURATION = 7
export const EXPEDITION_SEASON_UNLOCK_DAY = 3

export const EXPEDITION_HEALTH_LOSS_BASE: Record<ExpeditionDistance, number> = {
  near: 5,
  medium: 12,
  far: 20,
  extreme: 30,
}

export const EXPEDITION_FOOD_COST: Record<ExpeditionDistance, number> = {
  near: 10,
  medium: 20,
  far: 35,
  extreme: 50,
}

export const PERSONALITY_EXPEDITION_MODS: Record<string, { riskMod: number; rewardMod: number }> = {
  bold: { riskMod: 0.7, rewardMod: 1.3 },
  shy: { riskMod: 1.4, rewardMod: 0.8 },
  gentle: { riskMod: 1.1, rewardMod: 1.0 },
  curious: { riskMod: 1.0, rewardMod: 1.2 },
  stubborn: { riskMod: 0.9, rewardMod: 1.1 },
}
