import axios from 'axios'

type ErrorResponseData = {
  message?: string
  error?: string
}

const isErrorResponseData = (value: unknown): value is ErrorResponseData => {
  if (!value || typeof value !== 'object') return false
  return true
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (isErrorResponseData(data)) {
      const responseMessage = data.message ?? data.error
      if (typeof responseMessage === 'string' && responseMessage.trim().length > 0) {
        return responseMessage
      }
    }

    if (typeof error.message === 'string' && error.message.trim().length > 0) {
      return error.message
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallback
}
