import axios from 'axios'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
type AuthType = {
  user: any
  authenticated: boolean | null
  setUser: Dispatch<SetStateAction<any>>
  setAuthenticated: Dispatch<SetStateAction<boolean>>
  authLoading: boolean
  setAuthLoading: Dispatch<SetStateAction<boolean>>
}
export const AuthContext = createContext<AuthType>({
  user: null,
  authenticated: null,
  setUser: () => {},
  setAuthenticated: () => {},
  authLoading: true,
  setAuthLoading: () => {},
})

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await axios.get(
          'https://nestmate-backend-production.up.railway.app/api/users/checkAuth',
          {
            withCredentials: true,
          }
        )

        const { success, profileCompleted, user } = response.data

        setUser(user)
        if (success && profileCompleted === false) {
          return navigate('/register?profileCompleted=false')
        }
        setAuthenticated(success)
      } catch (error) {
        console.log('Auth error')
      }
    }
    checkAuth()
  }, [])
  useEffect(() => {}, [user])

  return (
    <AuthContext.Provider
      value={{ user, authenticated, setAuthenticated, setUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
