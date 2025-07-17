<template>
  <div class="community-page">
    <div class="community-content">
      <!-- Current Level -->
      <div class="current-level-section">
        <h3 class="section-title">{{ t('community.currentLevel') }}</h3>
        <div class="level-display">
          <div class="level-badge">Lv {{ walletState.apiUserInfo.Ua.Level }}</div>
          <div class="level-reward">{{ t('community.feeReward') }}:
            {{ levelRequirements[walletState.apiUserInfo.Ua.Level].reward }} %</div>

        </div>
      </div>

      <!-- Level Description -->
      <div class="level-description">
        <h3 class="section-title">{{ t('community.levelDescription') }}</h3>
        <ul class="description-list">
          <li>{{ t('community.description1') }}</li>
          <li>{{ t('community.description2') }}</li>
          <li>{{ t('community.description3') }}</li>
          <li>{{ t('community.description4') }}</li>
        </ul>
      </div>

      <!-- Level Requirements -->
      <div class="level-requirements">
        <h3 class="section-title">{{ t('community.levelRequirements') }}</h3>
        <div class="requirements-list">
          <div v-for="level in levelRequirements" :key="level.level"
            :class="['requirement-item', { 'current': level.level === walletState.apiUserInfo.Ua.Level }]">
            <div class="requirement-header">
              <div class="requirement-level">
                Lv{{ level.level }}
                <span v-if="level.level === walletState.apiUserInfo.Ua.Level" class="current-badge">{{ t('community.current')
                  }}</span>
              </div>
              <div class="requirement-reward">{{ level.reward }}%</div>
            </div>
            <div class="requirement-desc">{{ level.description }} <div class="reward-label">{{ t('community.reward') }}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { userStore } from '@/stores/user'
import { communityStore } from '@/stores/community'
import { t } from '@/utils/i18n'
import { formatNumber } from '@/utils/helpers'
import { useEthers } from '@/composables/useWallet'

const { walletState } = useEthers()
const levelRequirements = reactive([
  {
    level: 0,
    reward: 0,
    description: ''
  },
  {
    level: 1,
    reward: 20,
    description: 'B区业绩5万U'
  },
  {
    level: 2,
    reward: 10,
    description: '3个Lv1'
  },
  {
    level: 3,
    reward: 10,
    description: '3个Lv2'
  },
  {
    level: 4,
    reward: 10,
    description: '3个Lv3'
  },
  {
    level: 5,
    reward: 10,
    description: '3个Lv4'
  }
])
</script>

<style scoped>
.community-page {
  min-height: 100vh;
  padding: 0 0 20px 0;
}

.community-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
}

/* Current Level Section */
.current-level-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.level-display {
  text-align: center;
}

.level-badge {
  font-size: 2.5rem;
  font-weight: bold;
  color: #00d4ff;
  margin-bottom: 1rem;
  line-height: 1;
}

.level-reward {
  font-size: 1rem;
  color: white;
  font-weight: 500;
}

.progress-container {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #00a8cc);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* Level Description */
.level-description {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.description-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.description-list li {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 0.75rem;
  padding-left: 1rem;
  position: relative;
}

.description-list li::before {
  content: '•';
  color: #00d4ff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.description-list li:last-child {
  margin-bottom: 0;
}

/* Level Requirements */
.level-requirements {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.requirement-item {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.25rem;
  position: relative;
}

.requirement-item.current {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
}

.requirement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.requirement-level {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-badge {
  background: #00d4ff;
  color: #1a1a2e;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-weight: 600;
}

.requirement-reward {
  font-size: 1.1rem;
  font-weight: bold;
  color: #00d4ff;
}

.requirement-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
}

.reward-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .community-content {
    padding: 0.5rem;
    gap: 1rem;
  }

  .current-level-section,
  .level-description,
  .level-requirements,
  .reward-statistics {
    padding: 1.25rem;
  }

  .level-badge {
    font-size: 2rem;
  }

  .requirement-item {
    padding: 1rem;
  }

  .stats-row {
    /* flex-direction: column; */
    gap: 1rem;
  }

  .stat-item {
    width: 50%;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
