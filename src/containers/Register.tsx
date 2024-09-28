import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/authContext'
import Loading from '../components/Loading'
import AadharVerify from './AadharVerify'
import UserSignUp from './UserSignUp'
import UserDetails from './UserDetails'
import UserDetailsCont from './UserDetailsCont'
import UserPreferences from './UserPreferences'
import ProfileCompletion from './ProfileCompletion'
import VerifyOtp from '../containers/VerifyOtp'
import { UserCredentialsType } from '../types/types'
import { useNavigate, useSearchParams } from 'react-router-dom'

const Register = () => {
  const { authenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const [step, setStep] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [userCredentials, setUserCredentials] =
    useState<UserCredentialsType | null>(null)
  const [searchParams] = useSearchParams()
  const profileCompleted = searchParams.get('profileCompleted')
  console.log(typeof profileCompleted, profileCompleted)

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        if (authenticated) {
          return navigate('/')
        } else if (profileCompleted === 'false') {
          setStep(4)
        } else {
          setStep(1)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInformation()
  }, [])

  useEffect(() => {
    if (profileCompleted) setStep(4)
  }, [profileCompleted])

  useEffect(() => {
    if (authenticated) {
      navigate('/')
    }
  }, [authenticated])

  if (loading) return <Loading />
  else if (step === 1) return <AadharVerify setStep={setStep} />
  else if (step === 2)
    return (
      <UserSignUp setUserCredentials={setUserCredentials} setStep={setStep} />
    )
  else if (step === 3)
    return <VerifyOtp userCredentials={userCredentials} setStep={setStep} />
  else if (step === 4) return <UserDetails setStep={setStep} />
  else if (step === 5) return <UserDetailsCont setStep={setStep} />
  else if (step === 6) return <UserPreferences setStep={setStep} />
  else if (step === 7) return <ProfileCompletion setStep={setStep} />
}

export default Register
