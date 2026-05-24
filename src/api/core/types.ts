/**
 * API 核心类型定义
 * 提供统一的 API 响应类型和通用类型
 */

export type ApiMode = 'mock' | 'real'

export type PageResult<T> = {
  items: Array<T>
  total: number
  page: number
  pageSize: number
}

export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export type ApiError = {
  code: number
  message: string
  details?: unknown
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type RequestOptions = {
  query?: Record<string, unknown>
  body?: unknown
  headers?: Record<string, string>
}
