<template>
  <div class="team-page">
    <div class="team-content">
      <!-- Team Statistics -->
      <div class="team-statistics">
        <h3 class="section-title">{{ t('team.statistics') }}</h3>
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-value cyan">{{ teamStore.stats.totalMembers }}</div>
            <div class="stat-label">{{ t('team.totalPeople') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value green">{{ formatNumber(teamStore.stats.totalEarnings * 3) }}</div>
            <div class="stat-label">{{ t('team.totalContribution') }} (USDT)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value purple">{{ formatNumber(teamStore.stats.totalEarnings) }}</div>
            <div class="stat-label">{{ t('team.historicalRewards') }} (TIG)</div>
          </div>
        </div>
      </div>

      <!-- My Invitation Link -->
      <div class="invitation-section">
        <h3 class="section-title">{{ t('team.myInvitationLink') }}</h3>
        <div class="invitation-container">
          <div class="invitation-link">
            <input type="text" :value="teamStore.invitationLink" readonly class="link-input">
            <button class="copy-btn" @click="copyInvitationLink">
              📋
            </button>
          </div>
          <p class="invitation-description">
            {{ t('team.invitationDescription') }}
          </p>
        </div>
      </div>

      <!-- Team Members -->
      <div class="team-members">
        <h3 class="section-title">{{ t('team.teamMembers') }}</h3>
        <div class="members-list">
          <div v-for="member in teamStore.members" :key="member.id" class="member-item">
            <div class="member-info">
              <div class="member-name">{{ member.name }}</div>
              <div class="member-date">{{ formatDate(member.joinDate) }}</div>
            </div>
            <div class="member-details">
              <div class="member-level">{{ member.level }}</div>
              <div class="member-amount">{{ member.amount }} USDT</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Earnings -->
      <div class="team-earnings">
        <h3 class="section-title">{{ t('team.teamEarnings') }}</h3>
        <div class="earnings-container">
          <div class="earnings-info">
            <div class="earnings-amount">{{ formatNumber(userStore.stats.teamEarnings) }} TIG</div>
            <div class="earnings-label">{{ t('team.availableTeamEarnings') }}</div>
          </div>
          <AppButton variant="purple" class="withdraw-btn" :loading="withdrawLoading" @click="withdrawTeamEarnings">
            {{ t('team.withdrawTeamEarnings') }}
          </AppButton>
        </div>
        <ul class="earnings-rules">
          <li>{{ t('team.earningsRule1') }}</li>
          <li>{{ t('team.earningsRule2') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { teamStore } from '@/stores/team'
import { userStore } from '@/stores/user'
import { t, currentLang } from '@/utils/i18n'
import { formatDate, copyToClipboard, formatNumber, sleep } from '@/utils/helpers'
import AppButton from '@/components/AppButton.vue'

const withdrawLoading = ref(false)

const copyInvitationLink = async (): Promise<void> => {
  const success = await copyToClipboard(teamStore.invitationLink)
  if (success) {
    alert(currentLang.value === 'zh' ? '链接已复制' : 'Link copied')
  } else {
    alert(currentLang.value === 'zh' ? '复制失败' : 'Copy failed')
  }
}

const withdrawTeamEarnings = async (): Promise<void> => {
  withdrawLoading.value = true

  try {
    // Simulate withdrawal process
    await sleep(2000)
    console.log('Withdrawing team earnings')
    alert('Successfully withdrew team earnings!')
  } catch (error) {
    console.error('Withdrawal failed:', error)
    alert('Withdrawal failed!')
  } finally {
    withdrawLoading.value = false
  }
}
</script>

<style scoped>
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
  padding: 0.25rem 0.75rem;
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
  margin-bottom: 1.5rem;
}

.earnings-info {
  display: flex;
  flex-direction: column;
}

.earnings-amount {
  font-size: 1.8rem;
  font-weight: bold;
  color: rgb(192 132 252 );
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.earnings-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.withdraw-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 12px;
  white-space: nowrap;
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

  .withdraw-btn {
    /* width: 100%; */
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
