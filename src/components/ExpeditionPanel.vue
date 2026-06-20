<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameState } from '@/composables/useGameState'
import BirdSprite from './BirdSprite.vue'
import type { ExpeditionDistance } from '@/types/game'
import {
  EXPEDITION_DISTANCE_NAMES, EXPEDITION_DISTANCE_DESC,
  EXPEDITION_BASE_RISK, EXPEDITION_REWARD_MULTIPLIER,
  EXPEDITION_FOOD_COST, EXPEDITION_TEAM_SIZE,
  EXPEDITION_WEATHER_EFFECTS,
  RARE_RESOURCE_NAMES, RARE_RESOURCE_EMOJI, RARE_RESOURCE_COLORS, RARE_RESOURCE_RARITY,
  WEATHER_NAMES, PERSONALITY_NAMES, PERSONALITY_EMOJI,
} from '@/utils/constants'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const {
  state,
  createExpedition,
  toggleExpeditionBird,
  calculateExpeditionRisk,
  availableExpeditionBirds,
  activeExpeditions,
  completedExpeditions,
} = useGameState()

const selectedDistance = ref<ExpeditionDistance>('near')
const activeTab = ref<'prepare' | 'active' | 'history' | 'resources'>('prepare')

const distances: ExpeditionDistance[] = ['near', 'medium', 'far', 'extreme']

const currentRisk = computed(() => {
  if (state.selectedExpeditionBirdIds.length === 0) return 0
  return calculateExpeditionRisk(
    state.selectedExpeditionBirdIds,
    selectedDistance.value,
    state.currentWeather
  )
})

const canStartExpedition = computed(() => {
  return (
    state.selectedExpeditionBirdIds.length >= EXPEDITION_TEAM_SIZE.min &&
    state.selectedExpeditionBirdIds.length <= EXPEDITION_TEAM_SIZE.max &&
    state.foodStock >= EXPEDITION_FOOD_COST[selectedDistance.value] &&
    state.expeditionSeason.isActive
  )
})

const selectedBirds = computed(() => {
  return state.birds.filter(b => state.selectedExpeditionBirdIds.includes(b.id))
})

const handleStartExpedition = () => {
  if (!canStartExpedition.value) return
  createExpedition(state.selectedExpeditionBirdIds, selectedDistance.value)
  state.selectedExpeditionBirdIds = []
}

const getRiskColor = (risk: number) => {
  if (risk < 0.2) return 'text-green-400'
  if (risk < 0.4) return 'text-emerald-400'
  if (risk < 0.6) return 'text-yellow-400'
  if (risk < 0.8) return 'text-orange-400'
  return 'text-red-400'
}

const getRiskBarColor = (risk: number) => {
  if (risk < 0.2) return 'from-green-400 to-emerald-500'
  if (risk < 0.4) return 'from-emerald-400 to-green-500'
  if (risk < 0.6) return 'from-yellow-400 to-orange-500'
  if (risk < 0.8) return 'from-orange-400 to-red-500'
  return 'from-red-500 to-rose-600'
}

const getExpeditionBird = (birdId: string) => {
  return state.birds.find(b => b.id === birdId)
}

const formatTime = (ms: number) => {
  const seconds = Math.ceil(ms / 1000)
  if (seconds < 60) return `${seconds}秒`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

const getRemainingTime = (expedition: { returnTime: number }) => {
  const remaining = expedition.returnTime - Date.now()
  return Math.max(0, remaining)
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-forest-dark via-forest to-forest-light rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col">
      <div class="p-5 border-b border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🗺️</span>
          <div>
            <h2 class="font-display text-2xl text-yellow-300 text-stroke">候鸟远行赛季</h2>
            <div class="text-xs text-white/60">
              第 {{ state.expeditionSeason.seasonDay }} 天 · 还剩 {{ state.expeditionSeason.seasonEndDay - state.day }} 天
            </div>
          </div>
        </div>
        <button
          class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xl transition-all"
          @click="emit('close')"
        >
          ✕
        </button>
      </div>

      <div class="flex border-b border-white/10">
        <button
          v-for="tab in [
            { key: 'prepare', label: '组队出发', icon: '🧭' },
            { key: 'active', label: '进行中', icon: '🦅' },
            { key: 'history', label: '远征记录', icon: '📜' },
            { key: 'resources', label: '稀有物资', icon: '💎' },
          ]"
          :key="tab.key"
          :class="[
            'flex-1 px-4 py-3 text-sm font-medium transition-all',
            activeTab === tab.key
              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-b-2 border-yellow-400'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5',
          ]"
          @click="activeTab = tab.key as any"
        >
          <span class="mr-1.5">{{ tab.icon }}</span>
          {{ tab.label }}
          <span
            v-if="tab.key === 'active' && activeExpeditions.length > 0"
            class="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full"
          >
            {{ activeExpeditions.length }}
          </span>
        </button>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto p-5">
        <div v-if="activeTab === 'prepare'" class="space-y-5">
          <div v-if="!state.expeditionSeason.isActive" class="text-center py-12">
            <div class="text-5xl mb-4">⏳</div>
            <div class="text-lg text-white/70">
              候鸟远行赛季尚未开启
            </div>
            <div class="text-sm text-white/50 mt-2">
              第 3 天且有成鸟后自动开启
            </div>
          </div>

          <template v-else>
            <div>
              <div class="text-sm text-white/70 mb-3 flex items-center gap-2">
                <span>🐦</span>
                选择远征队员 ({{ state.selectedExpeditionBirdIds.length }}/{{ EXPEDITION_TEAM_SIZE.max }})
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div
                  v-for="bird in availableExpeditionBirds"
                  :key="bird.id"
                  :class="[
                    'p-3 rounded-xl cursor-pointer transition-all border-2',
                    state.selectedExpeditionBirdIds.includes(bird.id)
                      ? 'bg-yellow-500/20 border-yellow-400 scale-[1.02]'
                      : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/20',
                  ]"
                  @click="toggleExpeditionBird(bird.id)"
                >
                  <div class="flex flex-col items-center gap-2">
                    <BirdSprite
                      :stage="bird.stage"
                      :is-dead="bird.isDead"
                      :is-away="bird.isAway"
                      :is-sick="bird.isSick"
                      :personality="bird.personality"
                    />
                    <div class="text-sm font-medium text-white">{{ bird.name }}</div>
                    <div class="text-[10px] text-white/60 flex items-center gap-1">
                      {{ PERSONALITY_EMOJI[bird.personality] }} {{ PERSONALITY_NAMES[bird.personality] }}
                    </div>
                    <div class="w-full space-y-1">
                      <div class="flex justify-between text-[10px] text-white/50">
                        <span>❤️ 健康</span>
                        <span>{{ Math.round(bird.health) }}</span>
                      </div>
                      <div class="h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-gradient-to-r from-red-400 to-rose-500 transition-all"
                          :style="{ width: `${bird.health}%` }"
                        />
                      </div>
                    </div>
                    <div v-if="bird.expeditionCount !== undefined" class="text-[10px] text-amber-300">
                      远征 {{ bird.expeditionCount }} 次
                      <span v-if="bird.successfulExpeditions !== undefined">
                        (胜{{ bird.successfulExpeditions }})
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="availableExpeditionBirds.length === 0"
                  class="col-span-full text-center py-8 text-white/40 text-sm"
                >
                  没有可用的成鸟...
                </div>
              </div>
            </div>

            <div>
              <div class="text-sm text-white/70 mb-3 flex items-center gap-2">
                <span>🏔️</span>
                选择远征距离
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                  v-for="dist in distances"
                  :key="dist"
                  :class="[
                    'p-3 rounded-xl cursor-pointer transition-all border-2',
                    selectedDistance === dist
                      ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400'
                      : 'bg-white/5 border-transparent hover:bg-white/10',
                  ]"
                  @click="selectedDistance = dist"
                >
                  <div class="font-medium text-white text-sm mb-1">
                    {{ EXPEDITION_DISTANCE_NAMES[dist] }}
                  </div>
                  <div class="text-[10px] text-white/60 mb-2">
                    {{ EXPEDITION_DISTANCE_DESC[dist] }}
                  </div>
                  <div class="space-y-1 text-[10px]">
                    <div class="flex justify-between text-white/50">
                      <span>⏱️ 时长</span>
                      <span>{{ formatTime(EXPEDITION_DURATION[dist]) }}</span>
                    </div>
                    <div class="flex justify-between text-white/50">
                      <span>🍒 消耗</span>
                      <span>{{ EXPEDITION_FOOD_COST[dist] }}</span>
                    </div>
                    <div class="flex justify-between text-white/50">
                      <span>💰 倍率</span>
                      <span class="text-yellow-400">x{{ EXPEDITION_REWARD_MULTIPLIER[dist] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="glass rounded-2xl p-4">
              <div class="text-sm text-white/70 mb-3 flex items-center gap-2">
                <span>📊</span>
                风险评估
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-3">
                  <div>
                    <div class="flex justify-between text-sm mb-1">
                      <span class="text-white/70">综合风险</span>
                      <span :class="['font-bold', getRiskColor(currentRisk)]">
                        {{ (currentRisk * 100).toFixed(1) }}%
                      </span>
                    </div>
                    <div class="h-3 bg-black/30 rounded-full overflow-hidden">
                      <div
                        :class="['h-full bg-gradient-to-r transition-all duration-500', getRiskBarColor(currentRisk)]"
                        :style="{ width: `${currentRisk * 100}%` }"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5 text-xs">
                    <div class="flex justify-between text-white/60">
                      <span>🌤️ 当前天气</span>
                      <span>{{ WEATHER_NAMES[state.currentWeather] }}</span>
                    </div>
                    <div class="flex justify-between text-white/60">
                      <span>⚡ 天气风险加成</span>
                      <span :class="EXPEDITION_WEATHER_EFFECTS[state.currentWeather].riskMod > 1 ? 'text-red-400' : 'text-green-400'">
                        {{ EXPEDITION_WEATHER_EFFECTS[state.currentWeather].riskMod > 1 ? '+' : '' }}
                        {{ ((EXPEDITION_WEATHER_EFFECTS[state.currentWeather].riskMod - 1) * 100).toFixed(0) }}%
                      </span>
                    </div>
                    <div class="flex justify-between text-white/60">
                      <span>🐦 队伍人数</span>
                      <span>{{ state.selectedExpeditionBirdIds.length }} 只</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="text-xs text-white/70 mb-1">队伍成员:</div>
                  <div v-if="selectedBirds.length > 0" class="space-y-1.5">
                    <div
                      v-for="bird in selectedBirds"
                      :key="bird.id"
                      class="flex items-center gap-2 text-xs"
                    >
                      <span class="w-4 h-4 rounded-full bg-yellow-400/20 flex items-center justify-center text-[10px]">🐦</span>
                      <span class="text-white/80">{{ bird.name }}</span>
                      <span class="text-white/40 ml-auto">
                        健康 {{ Math.round(bird.health) }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="text-xs text-white/40 italic">
                    请选择远征队员...
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-center">
              <button
                :disabled="!canStartExpedition"
                :class="[
                  'px-8 py-3 rounded-2xl font-bold text-white btn-3d transition-all flex items-center gap-2',
                  canStartExpedition
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
                    : 'bg-gray-600/50 cursor-not-allowed opacity-60',
                ]"
                @click="handleStartExpedition"
              >
                <span class="text-xl">🚀</span>
                出发远征！
                <span class="text-xs opacity-80">
                  (消耗 {{ EXPEDITION_FOOD_COST[selectedDistance] }} 🍒)
                </span>
              </button>
            </div>
          </template>
        </div>

        <div v-if="activeTab === 'active'" class="space-y-4">
          <div v-if="activeExpeditions.length === 0" class="text-center py-12">
            <div class="text-5xl mb-4">🏕️</div>
            <div class="text-lg text-white/70">暂无进行中的远征</div>
            <div class="text-sm text-white/50 mt-2">组队出发后这里会显示进度</div>
          </div>

          <div
            v-for="expedition in activeExpeditions"
            :key="expedition.id"
            class="glass rounded-2xl p-4 space-y-3"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-2xl animate-bounce">🦅</span>
                <div>
                  <div class="font-medium text-white">
                    {{ EXPEDITION_DISTANCE_NAMES[expedition.distance] }}
                  </div>
                  <div class="text-xs text-white/50">
                    {{ expedition.birdIds.length }} 只小鸟远征中
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-yellow-300 font-medium">
                  {{ (expedition.progress * 100).toFixed(1) }}%
                </div>
                <div class="text-xs text-white/50">
                  还剩 {{ formatTime(getRemainingTime(expedition)) }}
                </div>
              </div>
            </div>

            <div class="h-2 bg-black/30 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 transition-all duration-300"
                :style="{ width: `${expedition.progress * 100}%` }"
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex -space-x-2">
                <div
                  v-for="birdId in expedition.birdIds"
                  :key="birdId"
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-forest flex items-center justify-center text-xs"
                >
                  🐦
                </div>
              </div>

              <div class="flex items-center gap-3 text-xs">
                <div class="flex items-center gap-1">
                  <span>🌤️</span>
                  <span class="text-white/70">{{ WEATHER_NAMES[expedition.currentWeather] }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <span>⚠️</span>
                  <span :class="getRiskColor(expedition.riskLevel)">
                    {{ (expedition.riskLevel * 100).toFixed(0) }}%
                  </span>
                </div>
              </div>
            </div>

            <div class="text-xs text-white/50">
              沿途天气: {{ expedition.weatherEncountered.map(w => WEATHER_NAMES[w]).join(' → ') }}
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'history'" class="space-y-3">
          <div v-if="completedExpeditions.length === 0" class="text-center py-12">
            <div class="text-5xl mb-4">📜</div>
            <div class="text-lg text-white/70">暂无远征记录</div>
            <div class="text-sm text-white/50 mt-2">完成远征后这里会有记录</div>
          </div>

          <div
            v-for="expedition in completedExpeditions"
            :key="expedition.id"
            :class="[
              'rounded-2xl p-4 border',
              expedition.success
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30',
            ]"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-xl">{{ expedition.success ? '✅' : '❌' }}</span>
                <span class="font-medium text-white">
                  {{ EXPEDITION_DISTANCE_NAMES[expedition.distance] }}
                </span>
              </div>
              <div class="text-xs text-white/50">
                {{ new Date(expedition.startTime).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
              </div>
            </div>

            <div class="text-xs text-white/70 mb-2">
              队员: {{ expedition.birdIds.map(id => getExpeditionBird(id)?.name || '?').join('、') }}
            </div>

            <div v-if="expedition.success" class="space-y-2">
              <div class="text-xs text-white/60">获得奖励:</div>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="reward in expedition.rewards"
                  :key="reward.id"
                  :class="['px-2 py-1 rounded-lg text-xs bg-gradient-to-r text-white', RARE_RESOURCE_COLORS[reward.type]]"
                >
                  {{ RARE_RESOURCE_EMOJI[reward.type] }} {{ RARE_RESOURCE_NAMES[reward.type] }} x{{ reward.amount }}
                </div>
              </div>
              <div class="text-xs text-red-300">
                体力消耗: -{{ expedition.healthLoss }} ❤️
              </div>
            </div>

            <div v-else class="text-xs text-red-300">
              远征失败，队伍受伤而归...
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'resources'" class="space-y-4">
          <div class="text-sm text-white/70 flex items-center gap-2">
            <span>💎</span>
            稀有物资仓库
          </div>

          <div v-if="state.rareResources.length === 0" class="text-center py-12">
            <div class="text-5xl mb-4">📦</div>
            <div class="text-lg text-white/70">仓库空空如也</div>
            <div class="text-sm text-white/50 mt-2">通过远征收集稀有物资吧！</div>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div
              v-for="resource in state.rareResources"
              :key="resource.id"
              :class="['p-4 rounded-2xl bg-gradient-to-br text-center card-shadow', RARE_RESOURCE_COLORS[resource.type]]"
            >
              <div class="text-4xl mb-2">{{ RARE_RESOURCE_EMOJI[resource.type] }}</div>
              <div class="font-medium text-white text-sm">{{ RARE_RESOURCE_NAMES[resource.type] }}</div>
              <div class="text-2xl font-bold text-white mt-1">{{ resource.amount }}</div>
              <div class="text-[10px] text-white/70 mt-1">
                稀有度: {'⭐'.repeat(RARE_RESOURCE_RARITY[resource.type])}
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-4 mt-6">
            <div class="text-sm text-white/70 mb-3">📊 赛季统计</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div class="text-2xl font-bold text-yellow-300">
                  {{ state.expeditionSeason.totalExpeditions }}
                </div>
                <div class="text-xs text-white/60">总远征次数</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-400">
                  {{ state.expeditionSeason.successfulExpeditions }}
                </div>
                <div class="text-xs text-white/60">成功次数</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-blue-400">
                  {{ state.expeditionSeason.totalExpeditions > 0
                    ? ((state.expeditionSeason.successfulExpeditions / state.expeditionSeason.totalExpeditions) * 100).toFixed(0)
                    : 0 }}%
                </div>
                <div class="text-xs text-white/60">成功率</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-400">
                  {{ state.rareResources.reduce((s, r) => s + r.amount, 0) }}
                </div>
                <div class="text-xs text-white/60">收集物资总数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
