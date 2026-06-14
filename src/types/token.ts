export interface TokenSummary {
  balance: number
  used: number
  refunded: number
}

export interface TokenType {
  id: string
  label: string
  available: number
  total: number | null
}

export type TransactionStatus = 'booked' | 'completed' | 'cancelled' | 'refunded'

export interface Transaction {
  id: string
  index: number
  coachName: string
  status: TransactionStatus
  debit: number | null
  credit: number | null
  date: string
  certificationLevel: string | null
  recordingUrl: string | null
}

export interface TxFilter {
  status?: TransactionStatus
  dateFrom?: string
  dateTo?: string
}
