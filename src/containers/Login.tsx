import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { passwordStrength } from 'check-password-strength'
import { AuthContext } from '../contexts/authContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import { IoMail } from 'react-icons/io5'
import { FaChevronLeft, FaLock } from 'react-icons/fa6'

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
    <div className="flex flex-col items-center bg-step2 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom bg-auto">
      <div className="items-center w-3/4">
        <button onClick={() => navigate('/')} className="mt-8 self-start">
          <FaChevronLeft color="#232beb" size={24} />
        </button>
        <div className="w-full flex flex-col justify-start mt-16 gap-24 animateRegistration">
          <div className="flex flex-col gap-2 ">
            <div
              className={`flex flex-col text-4xl font-poppins-bold text-primary `}
            >
              <span>Log In</span>
              <span>And Find </span>
              <span>The Perfect Roommate!</span>
            </div>
            <div className="capitalize text-primary font-poppins-light">
              you’re one click to finding your perfect roommate
            </div>
          </div>
          <form
            onSubmit={handleSubmit(async (data) => {
              console.log(data)
              setRequestPending(true)
              try {
                const response = await axios.post(
                  'https://nestmate-backend-production.up.railway.app/api/users/login',
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
                const { success, message, user, profileCompleted } =
                  response.data
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
                <div className="flex gap-4 w-full outline-1 outline px-6 py-4 outline-button-radio-button rounded-full focus:outline-2">
                  <IoMail size={21} color="#B8B8B8" className="flex-shrink-0" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                    })}
                    type="email"
                    placeholder="Email Address"
                    className="outline-none "
                  />
                </div>
                {/* <input
                className=""
                type="email"
                placeholder="Email Address"
                {...register('email', {
                  required: 'Email is required',
                })}
              /> */}
                {errors.email && (
                  <ErrorMessage text={errors.email.message as string} />
                )}
              </div>
              <div className="flex flex-col gap-1 ">
                <div className="flex gap-4 w-full outline-1 outline px-6 py-4 outline-button-radio-button rounded-full focus:outline-2">
                  <FaLock size={21} color="#B8B8B8" className="flex-shrink-0" />
                  <input
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
                    className="outline-none"
                  />
                </div>
                {errors.password && (
                  <ErrorMessage text={errors.password.message!.toString()} />
                )}
              </div>
              {loginError && <ErrorMessage text={loginError} />}
            </div>
            <div className="flex flex-col gap-3">
              <button
                disabled={requestPending}
                className="w-full rounded-full bg-button-primary py-4 text-2xl font-poppins-semi text-primary"
              >
                {requestPending ? (
                  <PulseLoader size={8} color="#232beb" />
                ) : (
                  'Log In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
