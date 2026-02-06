import { Navigate } from 'react-router-dom'
import { canAccess } from '../lib/useRole'

/**
 * Componente para proteger rotas por role
 * Redireciona para /home se o usuário não tiver permissão
 */
const RoleRoute = ({ user, requiredRole, children, redirectTo = '/home' }) => {
  const userRole = user?.role || 'student'
  
  // Verifica se tem permissão
  const hasAccess = canAccess(userRole, requiredRole)
  
  if (!hasAccess) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole.join(' ou ') : requiredRole
    console.warn(`🚫 Acesso negado: usuário com role '${userRole}' tentou acessar recurso que requer: ${requiredRoles}`)
    return <Navigate to={redirectTo} replace />
  }
  
  return children
}

export default RoleRoute
