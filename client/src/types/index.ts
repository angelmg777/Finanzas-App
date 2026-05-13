export type AccountType = 'DEBIT' | 'CREDIT' | 'CASH'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export interface User {
  id: string
  email: string
  name: string
}

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: string
  creditLimit: string
  currency: string
  color: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export interface Transaction {
  id: string
  type: TransactionType
  amount: string
  description?: string
  date: string
  account: {
    id: string
    name: string
    type: AccountType
    color: string
  }
  destinationAccount?: {
    id: string
    name: string
    type: AccountType
    color: string
  }
  category?: {
    id: string
    name: string
    icon: string
    color: string
  }
  createdAt: string
}

export interface AccountSummary {
  accounts: Account[]
  totalAssets: number
  totalDebt: number
  totalCreditLimit: number
  availableCredit: number
  netWorth: number
}

export interface PaginatedTransactions {
  transactions: Transaction[]
  total: number
  limit: number
  offset: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}