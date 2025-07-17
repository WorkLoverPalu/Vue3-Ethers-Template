<template>
  <div class="team-page">
    <div class="team-content">
      <!-- Team Statistics -->
      <div class="team-statistics">
        <h3 class="section-title">{{ t('team.statistics') }}</h3>
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value cyan">{{ team.total }}</div>
            <div class="stat-label">{{ t('team.有效团队人数') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value green">{{ formatNumber(team.teamPerformance) }}</div>
            <div class="stat-label">{{ t('team.团队总业绩') }} (USDT)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value purple">{{ formatNumber(team.totalProfit) }}</div>
            <div class="stat-label">{{ t('team.团队总收益') }} (TIG)</div>
          </div>
        </div>
      </div>

      <!-- My Invitation Link -->
      <div class="invitation-section">
        <h3 class="section-title">{{ t('team.myInvitationLink') }}</h3>
        <div class="invitation-container">
          <div class="invitation-link">
            <textarea type="text" :value="invitationLink" :rows="3" readonly class="link-input"></textarea>
            <button class="copy-btn" @click="copyInvitationLink">
              📋
            </button>
          </div>
          <p class="invitation-description">
            {{ t('team.invitationDescription') }}
          </p>
        </div>
      </div>

      <div class="team-earnings">
        <h3 class="section-title">{{ t('team.我的上级') }}</h3>
        <div class="earnings-container">
          {{ walletState.apiUserInfo.PAddr }}
        </div>
      </div>

      <!-- Team Members -->
      <div class="team-members">
        <div class="members-header">
          <h3 class="section-title">{{ t('team.teamMembers') }}</h3>
          <div class="pagination-controls">
            <button class="pagination-btn" :disabled="team.size <= 0" @click="prevPage">
              &lt;
            </button>
            <span class="page-info">
              {{ team.size + 1 }} / {{ Math.ceil(team.total / team.limit) }}
            </span>
            <button class="pagination-btn" :disabled="(team.size + 1) * team.limit >= team.total" @click="nextPage">
              &gt;
            </button>
          </div>
        </div>
        <div class="members-list">
          <div v-for="member in team.dataList" :key="member.id" class="member-item">
            <div class="member-info">
              <div class="member-name">{{ shortAddress(member.Addr) }}</div>
              <div class="member-date">{{ member.CreateTime }}</div>
            </div>
            <div class="member-details">
              <div class="member-level">{{ t('team.个人业绩') }}</div>
              <div class="member-amount">{{ member.Performance }} USDT</div>
            </div>
          </div>
          <div v-if="team.dataList.length === 0" class="no-members">
            {{ t('team.noMembers') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { t, currentLang } from '@/utils/i18n'
import { formatDate, copyToClipboard, } from '@/utils/helpers'
import { shortAddress, formatNumber, sleep } from '@/utils/formatters'
import AppButton from '@/components/AppButton.vue'
import request from '@/utils/request'
import { useEthers } from '@/composables/useWallet'

const withdrawLoading = ref(false)
const { walletState } = useEthers()
const invitationLink = ref(null);
const team = ref<any>({
  "limit": 10,
  "size": 0, // current page (0-based)
  "total": 0,
  "totalProfit": 0,
  "teamPerformance": 0,
  "dataList": []
})

const copyInvitationLink = async (): Promise<void> => {
  const success = await copyToClipboard(invitationLink.value)
  if (success) {
    alert(currentLang.value === 'zh' ? '链接已复制' : 'Link copied')
  } else {
    alert(currentLang.value === 'zh' ? '复制失败' : 'Copy failed')
  }
}

const fetchData = async () => {
  try {
    const res = await request.post(`/Team?addr=${walletState.value.account}&limit=${team.value.limit}&size=${team.value.size}`);
    let teamInfo = {
      ...res.data,
      totalProfit: res.data.dataList
        .reduce((sum, item) => sum + item.TotalProfit, 0),
      teamPerformance: res.data.dataList
        .reduce((sum, item) => sum + item.TeamPerformance, 0),
    }
    team.value = teamInfo;
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}

const nextPage = () => {
  if ((team.value.size + 1) * team.value.limit < team.value.total) {
    team.value.size += 1
    fetchData()
  }
}

const prevPage = () => {
  if (team.value.size > 0) {
    team.value.size -= 1
    fetchData()
  }
}

watch(() => walletState.value.isConnected, (connected) => {
  if (connected) {
    fetchData()
  }
})

onMounted(() => {
  if (walletState.value.isConnected) {
    fetchData()
    invitationLink.value = `${window.location.origin}/#/?invite=${walletState.value.account}`
  }
})
</script>

<style scoped>
/* Previous styles remain the same, add these new styles */

.members-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.no-members {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}



.team-page {
  min-height: 100vh;
  padding: 0 0 20px 0;
}

.team-content {
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

/* Team Statistics */
.team-statistics {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-item {
  text-align: center;
  flex: 0.3;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.stat-value.cyan {
  color: #00d4ff;
}

.stat-value.green {
  color: #00e676;
}

.stat-value.purple {
  color: #e91e63;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

/* Invitation Section */
.invitation-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.invitation-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invitation-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 0.75rem;

}

.link-input {
  flex: 1;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  outline: none;
}

.copy-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
  transition: color 0.3s ease;
}

.copy-btn:hover {
  color: #00d4ff;
}

.invitation-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin: 0;
}

/* Team Members */
.team-members {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.member-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 0.9rem;
  color: white;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.member-date {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.member-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* outline: solid 1px red; */
}

.member-level {
  /* background: linear-gradient(45deg, #00d4ff, #5b86e5); */
  color: #00d4ff;
  /* padding: 0.25rem 0.75rem; */
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.member-amount {
  font-size: 0.85rem;
  color: #00e676;
  font-weight: 600;
}

/* Team Earnings */
.team-earnings {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.earnings-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 10px;
  width: 100%;
  word-break: break-word;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
}

.earnings-info {
  display: flex;
  flex-direction: column;
}

.earnings-amount {
  font-size: 1.8rem;
  font-weight: bold;
  color: rgb(192 132 252);
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.earnings-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}



.earnings-rules {
  list-style: none;
  padding: 0;
  margin: 0;
}

.earnings-rules li {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.earnings-rules li::before {
  content: '•';
  color: #00d4ff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.earnings-rules li:last-child {
  margin-bottom: 0;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .team-content {
    padding: 0.5rem;
    gap: 1rem;
  }

  .team-statistics,
  .invitation-section,
  .team-members,
  .team-earnings {
    padding: 1.25rem;
  }

  .stats-row {
    /* flex-direction: column; */
    gap: 1rem;
  }

  .stat-item {
    width: 32%;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .earnings-container {
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 1rem;
  }



  .member-item {
    /* flex-direction: column; */
    align-items: flex-start;
    gap: 0.5rem;
  }

  /* .member-details {
    align-items: flex-start;
    flex-direction: row;
    gap: 1rem;
  } */
}
</style>
