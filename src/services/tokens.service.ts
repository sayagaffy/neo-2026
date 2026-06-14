import type { TokenSummary, TokenType, Transaction, TxFilter } from '@/types'
import {
  TOKEN_SUMMARY_MOCK,
  TOKEN_TYPES_MOCK,
  TRANSACTIONS_MOCK,
} from '@/mocks/tokens.mock'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

function normalizeSummary(raw: unknown): TokenSummary {
  const r = raw as Record<string, unknown>
  const balance = Number(r['balance'])
  const used = Number(r['used'])
  const refunded = Number(r['refunded'])
  return {
    balance: isNaN(balance) ? 0 : balance,
    used: isNaN(used) ? 0 : used,
    refunded: isNaN(refunded) ? 0 : refunded,
  }
}

function normalizeType(raw: unknown): TokenType {
  const r = raw as Record<string, unknown>
  const total = Number(r['total'])
  return {
    id: String(r['id'] ?? ''),
    label: String(r['label'] ?? ''),
    available: Number(r['available']) || 0,
    total: isNaN(total) ? null : total,
  }
}

function normalizeTransaction(raw: unknown): Transaction {
  const r = raw as Record<string, unknown>
  const debit = Number(r['debit'])
  const credit = Number(r['credit'])
  return {
    id: String(r['id'] ?? ''),
    index: Number(r['index']) || 0,
    coachName: String(r['coachName'] ?? ''),
    status: (r['status'] as Transaction['status']) ?? 'completed',
    debit: isNaN(debit) || r['debit'] == null ? null : debit,
    credit: isNaN(credit) || r['credit'] == null ? null : credit,
    date: String(r['date'] ?? ''),
    certificationLevel:
      typeof r['certificationLevel'] === 'string' && r['certificationLevel']
        ? r['certificationLevel']
        : null,
    recordingUrl:
      typeof r['recordingUrl'] === 'string' && r['recordingUrl'] ? r['recordingUrl'] : null,
  }
}

export async function fetchTokenSummary(): Promise<TokenSummary> {
  await delay(300)
  return normalizeSummary(TOKEN_SUMMARY_MOCK)
}

export async function fetchTokenTypes(): Promise<TokenType[]> {
  await delay(300)
  return TOKEN_TYPES_MOCK.map(normalizeType)
}

export async function fetchTransactions(filter?: TxFilter): Promise<Transaction[]> {
  await delay(400)
  let txs = TRANSACTIONS_MOCK.map(normalizeTransaction)
  if (filter?.status) txs = txs.filter((t) => t.status === filter.status)
  if (filter?.dateFrom) txs = txs.filter((t) => t.date >= filter.dateFrom!)
  if (filter?.dateTo) txs = txs.filter((t) => t.date <= filter.dateTo!)
  return txs
}
