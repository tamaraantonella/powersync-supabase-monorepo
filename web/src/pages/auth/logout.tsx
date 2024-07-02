import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@shared/providers/AuthProvider'

const Logout = () => {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      logout()
    }
    navigate('/login')
  }, [isAuthenticated, logout, navigate])

  return null
}

export default Logout
