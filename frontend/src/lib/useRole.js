import { useMemo } from 'react'

/**
 * Hook para verificar role do usuário atual
 * @param {Object} user - Objeto do usuário com propriedade 'role'
 * @returns {Object} - { isAdmin, isVendor, isStudent, role }
 */
export const useRole = (user) => {
  return useMemo(() => {
    const role = user?.role || 'student'
    
    return {
      isAdmin: role === 'admin',
      isVendor: role === 'vendor',
      isStudent: role === 'student' || !user?.role,
      role
    }
  }, [user?.role])
}

/**
 * Verifica se o usuário tem permissão para acessar determinado recurso
 * @param {string} userRole - Role do usuário (admin/vendor/student)
 * @param {string|string[]} requiredRole - Role(s) necessária(s) para acesso
 * @returns {boolean}
 */
export const canAccess = (userRole, requiredRole) => {
  if (!requiredRole) return true
  
  // Admin tem acesso a tudo
  if (userRole === 'admin') return true
  
  // Se requiredRole for array, verifica se userRole está incluído
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }
  
  // Verifica role específica
  return userRole === requiredRole
}

/**
 * Hierarquia de roles para comparação
 */
const ROLE_HIERARCHY = {
  admin: 3,
  vendor: 2,
  student: 1
}

/**
 * Verifica se o usuário tem role igual ou superior
 * @param {string} userRole - Role do usuário
 * @param {string} minimumRole - Role mínima necessária
 * @returns {boolean}
 */
export const hasMinimumRole = (userRole, minimumRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0
  return userLevel >= requiredLevel
}
