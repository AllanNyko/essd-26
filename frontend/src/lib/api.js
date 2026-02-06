export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const parseJson = async (response) => {
  const text = await response.text()

  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: 'Resposta inválida do servidor.' }
  }
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('essd_token')
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

export const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem('essd_token')
  const headers = {
    'Accept': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// Verifica se o token está próximo de expirar (dentro de 1 hora)
export const isTokenExpiringSoon = () => {
  const tokenTime = localStorage.getItem('essd_token_time')
  if (!tokenTime) return true
  
  const tokenDate = new Date(tokenTime)
  const now = new Date()
  const hourInMs = 60 * 60 * 1000
  const diffMs = tokenDate.getTime() - now.getTime()
  
  // Se falta menos de 1 hora para expirar ou já expirou
  return diffMs < hourInMs
}

// Renova o token automaticamente
export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('essd_token')
    if (!token) return false
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) return false
    
    const data = await parseJson(response)
    
    if (data.token) {
      localStorage.setItem('essd_token', data.token)
      localStorage.setItem('essd_token_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
      if (data.user) {
        localStorage.setItem('essd_user', JSON.stringify(data.user))
      }
      return true
    }
    
    return false
  } catch {
    return false
  }
}


