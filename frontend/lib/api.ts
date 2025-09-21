import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Chat API
export interface ChatRequest {
  message: string
  debug?: boolean
}

export interface ChatResponse {
  answer: string
  debug_info?: any
}

export const postChat = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post('/chat', data)
  return response.data
}

// FAQ API
export interface FAQ {
  id: number
  question: string
  answer: string
  category_id?: number
  is_active: boolean
  created_at: string
  updated_at?: string
  category?: {
    id: number
    name: string
    slug: string
  }
}

export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
}

export interface FAQCreate {
  question: string
  answer: string
  category_id?: number
  is_active?: boolean
}

export interface FAQUpdate {
  question?: string
  answer?: string
  category_id?: number
  is_active?: boolean
}

export interface FAQListResponse {
  items: FAQ[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export const getFAQs = async (): Promise<FAQ[]> => {
  const response = await api.get('/faqs')
  return response.data.items || response.data
}

export const getFAQ = async (id: number): Promise<FAQ> => {
  const response = await api.get(`/faqs/${id}`)
  return response.data
}

export const createFAQ = async (data: FAQCreate): Promise<FAQ> => {
  const response = await api.post('/faqs', data)
  return response.data
}

export const updateFAQ = async (id: number, data: FAQUpdate): Promise<FAQ> => {
  const response = await api.put(`/faqs/${id}`, data)
  return response.data
}

export const deleteFAQ = async (id: number): Promise<void> => {
  await api.delete(`/faqs/${id}`)
}

export const reindexFAQs = async (): Promise<void> => {
  await api.post('/faqs/reindex')
}

// Category API
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories')
  return response.data
}

export const createCategory = async (data: { name: string; slug: string }): Promise<Category> => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (id: number, data: { name: string; slug: string }): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`)
}

// Log API
export interface ChatLog {
  id: number
  timestamp: string
  user_text: string
  ai_text: string
  intent?: string
  source?: string
  confidence?: number
  success: boolean
  matched_faq_id?: number
  tokens_in?: number
  tokens_out?: number
  latency_ms?: number
  notes?: string
}

export interface LogFilters {
  success?: boolean
  intent?: string
  unanswered_only?: boolean
  from_date?: string
  to_date?: string
  page?: number
  page_size?: number
}

export interface LogListResponse {
  items: ChatLog[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export const getLogs = async (filters?: {
  start_date?: string
  end_date?: string
  intent?: string
  response_source?: string
  unanswered_in_db?: string
}): Promise<ChatLog[]> => {
  const response = await api.get('/logs', { params: filters })
  return response.data.items || response.data
}

export const getLogStats = async (): Promise<any> => {
  const response = await api.get('/logs/stats')
  return response.data
}

export const deleteLog = async (id: number): Promise<void> => {
  await api.delete(`/logs/${id}`)
}
