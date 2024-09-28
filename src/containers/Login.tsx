import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { passwordStrength } from 'check-password-strength'
import { AuthContext } from '../contexts/authContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'

export default () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [userInformation, setUserInformation] = useState({})
  const [loginError, setLoginError] = useState<null | string>(null)
  const { authenticated, setAuthenticated, setUser } = useContext(AuthContext)
  useEffect(() => {
    if (authenticated) return navigate('/')
    const userInformationJson = localStorage.getItem('userInformation')

    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])

  useEffect(() => {}, [userInformation])
  useEffect(() => {
    if (authenticated) return navigate('/')
  }, [authenticated])

  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [requestPending, setRequestPending] = useState(false)
  if (loading || authenticated === null) return <Loading />
  return (
    <div className="flex flex-col items-center bg-step2 bg-no-repeat h-screen max-h-screen bg-bottom bg-auto animateRegistration">
      <div className="w-3/4 flex flex-col justify-start mt-16 gap-24">
        <div className={`flex flex-col text-4xl font-bold text-primary `}>
          <span>Log In</span>
          <span>And Find </span>
          <span>The Perfect Roommate</span>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data)
            setRequestPending(true)
            try {
              const response = await axios.post(
                'https://nestmate-backend-9f3d331450ee.herokuapp.com/api/users/login',
                data,
                {
                  withCredentials: true,
                }
              )

              console.log(
                'Response data:',
                response.data,
                'Status:',
                response.status
              )
              const { success, message, user, profileCompleted } = response.data
              setUser(user)
              if (success) {
                if (!profileCompleted) {
                  return navigate('/register?profileCompleted=false')
                }
                setAuthenticated(true)
                console.log('NAVGAITNG RN TO HOME FRMO LOGIN')

                return navigate('/')
              } else {
                setLoginError(message)
              }
            } catch (error) {
              console.error('Login error:', error)
              setLoginError(
                error?.response?.data?.message ||
                  'Some error occurred while making the request'
              )
            } finally {
              setRequestPending(false)
            }
          })}
          className="flex flex-col gap-12"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <input
                className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                })}
                placeholder="Email Address"
              />
              {errors.email && (
                <ErrorMessage text={errors.email.message as string} />
              )}
            </div>
            <div className="flex flex-col gap-1 ">
              <input
                className="w-full outline-1 outline p-4 outline-black rounded-full focus:outline-2"
                type="password"
                {...register('password', {
                  required: 'password is required',
                  minLength: {
                    value: 10,
                    message: 'Password should be at least 10 characters',
                  },
                  validate: (data) => {
                    return (
                      !(passwordStrength(data).id < 1) ||
                      'Password is too weak. Add numbers and special characters to it.'
                    )
                  },
                })}
                placeholder="Password"
              />
              {errors.password && (
                <ErrorMessage text={errors.password.message!.toString()} />
              )}
            </div>
            {loginError && <ErrorMessage text={loginError} />}
          </div>
          <div className="flex flex-col gap-3">
            <button
              disabled={requestPending}
              className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
            >
              {requestPending ? (
                <PulseLoader size={8} color="#232beb" />
              ) : (
                'Next'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
