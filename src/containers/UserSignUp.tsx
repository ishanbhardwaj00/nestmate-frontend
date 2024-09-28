import { useState, SetStateAction, Dispatch } from 'react'
import { useForm } from 'react-hook-form'
import { passwordStrength } from 'check-password-strength'
import ErrorMessage from '../components/ErrorMessage'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { UserCredentialsType } from '../types/types'
import { useNavigate } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa'
import { IoMail } from 'react-icons/io5'

export default ({
  setStep,
  setUserCredentials,
}: {
  setStep: Dispatch<SetStateAction<number>>

  setUserCredentials: Dispatch<SetStateAction<UserCredentialsType | null>>
}) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()
  const [signUpError, setSignUpError] = useState(null)

  const navigate = useNavigate()
  const [otpError, setOtpError] = useState(null)
  const [requestPending, setRequestPending] = useState(false)

  return (
    <div className="flex flex-col items-center bg-step2 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom">
      <div className="w-3/4 flex flex-col justify-start mt-10 gap-24 animateRegistration">
        <div className="flex flex-col gap-12">
          <button className="text-black" onClick={() => navigate('/')}>
            <FaChevronLeft color="#232beb" size={24} />
          </button>
          <div
            className={`flex flex-col text-4xl font-poppins-bold text-primary `}
          >
            <span>Secure Your </span>
            <span>Access &</span>
            <span>Login Anytime!</span>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            setRequestPending(true)
            setSignUpError(null)
            setUserCredentials({ email: data.email, password: data.password })
            try {
              const response = await axios.post(
                'https://nestmate-backend-production.up.railway.app/api/users/generateOtp',
                {
                  email: data.email,
                }
              )
              const { success, message } = response.data
              console.log(response.data)

              if (!success) {
                setOtpError(message)
              } else {
                setStep((step: number) => step + 1)
              }
            } catch (error: any) {
              setOtpError(error.message)
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
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                  })}
                  placeholder="Email Address"
                  className="outline-none w-4/5 focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.email && (
                <ErrorMessage text={errors.email.message as string} />
              )}
            </div>
            <div className="flex flex-col gap-1 ">
              <div className="flex gap-4 w-full outline-1 outline px-6 py-4 outline-button-radio-button rounded-full focus:outline-2">
                <IoMail size={21} color="#B8B8B8" className="flex-shrink-0" />
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
                  className="outline-none w-4/5 focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.password && (
                <ErrorMessage text={errors.password.message!.toString()} />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-4 w-full outline-1 outline px-6 py-4 outline-button-radio-button rounded-full focus:outline-2">
                <IoMail size={21} color="#B8B8B8" className="flex-shrink-0" />
                <input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Confirm password is required',
                    validate: (value) =>
                      value === getValues('password') || 'Passwords must match',
                  })}
                  placeholder="Confirm Password"
                  className="outline-none w-4/5 focus:ring-0 focus:outline-none"
                />
              </div>
              {errors.confirmPassword && (
                <ErrorMessage
                  text={errors.confirmPassword.message!.toString()}
                />
              )}
            </div>
            {signUpError && <ErrorMessage text={signUpError} />}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label
                className="flex flex-row items-center w-5/6 self-center gap-2"
                htmlFor="tc"
              >
                <input
                  {...register('tc', {
                    required:
                      'Please confirm you have read and understood the Terms & Conditions and Privacy policy',
                  })}
                  type="checkbox"
                  value="tc"
                  id="tc"
                />
                <span className="italic  text-xs">
                  I agree to Homigo’s Terms & Conditions and Privacy Policy
                </span>
              </label>
              {errors.tc && (
                <ErrorMessage text={errors.tc.message!.toString()} />
              )}
            </div>
            {otpError && <ErrorMessage text={otpError} />}
            <button
              disabled={requestPending}
              className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
            >
              {requestPending ? (
                <PulseLoader color="#232beb" size={8} />
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
