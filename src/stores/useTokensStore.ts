import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TokenSummary, TokenType, Transaction, TxFilter, AsyncState } from '@/types'
import { initAsync } from '@/types'
import { fetchTokenSummary, fetchTokenTypes, fetchTransactions } from '@/services/tokens.service'

export const useTokensStore = defineStore('tokens', () => {
  const summary = ref<AsyncState<TokenSummary>>(initAsync())
  const types = ref<AsyncState<TokenType[]>>(initAsync())
  const transactions = ref<AsyncState<Transaction[]>>(initAsync())
  const activeFilter = ref<TxFilter>({})

  const balance = computed(() => summary.value.data?.balance ?? null)

  async function loadSummary() {
    summary.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchTokenSummary()
      summary.value = { data, status: 'success', error: null }
    } catch (e) {
      summary.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load token summary',
      }
    }
  }

  async function loadTypes() {
    types.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchTokenTypes()
      types.value = { data, status: 'success', error: null }
    } catch (e) {
      types.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load token types',
      }
    }
  }

  async function loadTransactions(filter?: TxFilter) {
    if (filter !== undefined) activeFilter.value = filter
    transactions.value = { data: null, status: 'loading', error: null }
    try {
      const data = await fetchTransactions(activeFilter.value)
      transactions.value = { data, status: 'success', error: null }
    } catch (e) {
      transactions.value = {
        data: null,
        status: 'error',
        error: e instanceof Error ? e.message : 'Failed to load transactions',
      }
    }
  }

  return {
    summary,
    types,
    transactions,
    activeFilter,
    balance,
    loadSummary,
    loadTypes,
    loadTransactions,
  }
})
