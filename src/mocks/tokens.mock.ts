import type { TokenSummary, TokenType, Transaction } from '@/types'

export const TOKEN_SUMMARY_MOCK: TokenSummary = {
  balance: 12,
  used: 8,
  refunded: 1,
}

export const TOKEN_TYPES_MOCK: TokenType[] = [
  { id: 'tt-1', label: 'Standard Session', available: 8, total: 20 },
  { id: 'tt-2', label: 'Premium Session', available: 4, total: null },
]

export const TRANSACTIONS_MOCK: Transaction[] = [
  {
    id: 'tx-001',
    index: 1,
    coachName: 'Sarah Mitchell',
    status: 'completed',
    debit: 3,
    credit: null,
    date: '2026-06-10T10:00:00+07:00',
    certificationLevel: 'B2 neoPrep+',
    recordingUrl: 'https://recordings.example.com/tx-001',
  },
  {
    id: 'tx-002',
    index: 2,
    coachName: 'James Tan',
    status: 'refunded',
    debit: null,
    credit: 2,
    date: '2026-06-08T09:00:00+07:00',
    certificationLevel: null,
    recordingUrl: null,
  },
  {
    id: 'tx-003',
    index: 3,
    coachName: 'Elena Vasquez',
    status: 'cancelled',
    debit: null,
    credit: null,
    date: '2026-06-05T14:00:00+07:00',
    certificationLevel: null,
    recordingUrl: null,
  },
  {
    id: 'tx-004',
    index: 4,
    coachName: 'David Kim',
    status: 'booked',
    debit: 3,
    credit: null,
    date: '2026-06-16T14:00:00+07:00',
    certificationLevel: 'B2 neoPrep+',
    recordingUrl: null,
  },
]

// Broken case: empty transaction history
export const TRANSACTIONS_EMPTY_MOCK: Transaction[] = []
