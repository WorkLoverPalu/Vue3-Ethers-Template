<template>
    <div class="contract-interaction">
        <h3>Contract Interaction</h3>

        <div v-if="walletState.isConnected">
            <div class="form-group">
                <label>Contract Address</label>
                <input v-model="contractAddress" type="text" placeholder="0x..." />
            </div>

            <div class="form-group">
                <label>ABI</label>
                <textarea v-model="contractAbi" placeholder="Paste contract ABI here..."></textarea>
            </div>

            <button @click="initContract" class="btn">Initialize Contract</button>

            <div v-if="contract" class="contract-methods">
                <h4>Contract Methods</h4>
                <div v-for="(method, index) in availableMethods" :key="index" class="method-item">
                    <div class="method-name">{{ method.name }}</div>
                    <div v-if="method.inputs.length > 0" class="method-inputs">
                        <input v-for="(input, i) in method.inputs" :key="i" v-model="methodParams[method.name][i]"
                            :placeholder="input.type" />
                    </div>
                    <button @click="callMethod(method)" class="btn btn-sm">
                        {{ method.stateMutability === 'view' ? 'Call' : 'Send' }}
                    </button>
                    <div v-if="methodResults[method.name]" class="method-result">
                        Result: {{ methodResults[method.name] }}
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="not-connected">
            Please connect your wallet to interact with contracts
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ethers } from 'ethers'
import { useEthers } from '@/composables/useEthers'

const { walletState, getContract } = useEthers()

const contractAddress = ref('')
const contractAbi = ref('')
const contract = ref<ethers.Contract | null>(null)
const methodParams = ref<Record<string, any[]>>({})
const methodResults = ref<Record<string, any>>({})

const availableMethods = computed(() => {
    if (!contract.value) return []

    return contract.value.interface.fragments
        .filter(f => f.type === 'function')
        .map(f => ({
            name: f.name,
            inputs: f.inputs,
            stateMutability: f.stateMutability
        }))
})

watch(availableMethods, (methods) => {
    methodParams.value = {}
    methods.forEach(method => {
        methodParams.value[method.name] = method.inputs.map(() => '')
    })
})

const initContract = () => {
    try {
        const abi = JSON.parse(contractAbi.value)
        contract.value = getContract(contractAddress.value, abi)
        methodResults.value = {}
    } catch (error) {
        console.error('Error initializing contract:', error)
        alert('Invalid contract ABI or address')
    }
}

const callMethod = async (method: any) => {
  if (!contract.value) return
  
  try {
    const params = methodParams.value[method.name].map((p, i) => {
      const inputType = method.inputs[i].type
      if (inputType.includes('int')) return ethers.BigNumber.from(p || '0')  // v5 使用 BigNumber
      if (inputType === 'bool') return p === 'true'
      return p
    })
    
    if (method.stateMutability === 'view') {
      const result = await contract.value[method.name](...params)
      methodResults.value[method.name] = result.toString()
    } else {
      const tx = await contract.value[method.name](...params)
      methodResults.value[method.name] = `Tx Hash: ${tx.hash}`
      await tx.wait()
      methodResults.value[method.name] += ' (confirmed)'
    }
  } catch (error) {
    console.error('Error calling method:', error)
    methodResults.value[method.name] = `Error: ${error.message}`
  }
}
</script>

<style scoped>
.contract-interaction {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin-top: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
}

.form-group textarea {
    min-height: 100px;
}

.contract-methods {
    margin-top: 1rem;
}

.method-item {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
}

.method-name {
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.method-inputs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.method-inputs input {
    flex: 1;
    padding: 0.25rem;
}

.method-result {
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #f5f5f5;
    border-radius: 0.25rem;
    font-size: 0.9rem;
}

.btn {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
}

.not-connected {
    color: #888;
    font-style: italic;
}
</style>