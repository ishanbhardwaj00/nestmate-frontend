import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import { UserCredentialsType } from '../types/types'
import axios from 'axios'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaChevronLeft } from 'react-icons/fa'
import { GoArrowLeft } from 'react-icons/go'
import { BarLoader } from 'react-spinners'

const VerifyOtp = ({
  userCredentials,
  setStep,
}: {
  userCredentials: UserCredentialsType | null
  setStep: Dispatch<SetStateAction<number>>
}) => {
  useEffect(() => {
    setLoading(true)
    setLoading(false)
  }, [])
  const {
    getValues,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm()

  const [loading, setLoading] = useState(false)
  const [userInformation, setUserInformation] = useState({})
  const [otpVerificationError, setOtpVerificationError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const userInformationJson = localStorage.getItem('userInformation')
    if (userInformationJson) {
      setUserInformation(JSON.parse(userInformationJson))
    }
    setLoading(false)
  }, [])
  if (loading) return <Loading />

  return (
    <div className="flex flex-col items-center bg-step1 bg-contain bg-no-repeat h-screen max-h-screen bg-bottom animateRegistration ">
      <div className="w-3/4 flex flex-col justify-start mt-10 gap-16">
        <button onClick={() => setStep((step) => step - 1)}>
          <FaChevronLeft color='#232beb' size={24} />
        </button>
        <div className={`flex flex-col text-4xl font-poppins-bold text-primary `}>
          <span>We've</span>
          <span>Sent You</span>
          <span>A Code</span>
          {/* <span>Aadhar</span> */}
        </div>
        <div className={`flex flex-col gap-7`}>
          <form
            autoComplete="off"
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(async (data) => {
              console.log(data)
              setLoading(true)
              // localStorage.setItem(
              //   'userInformation',
              //   JSON.stringify({ ...userInformation, verified: true })
              // )
              try {
                const verifyResponse = await axios.post(
                  'https://nestmate-backend-production.up.railway.app/api/users/verifyOTP',
                  { email: userCredentials!.email, ...data }
                )

                const { success, message } = verifyResponse.data
                console.log(message)
                if (success) {
                  console.log(userCredentials)

                  const response = await axios.post(
                    'https://nestmate-backend-production.up.railway.app/api/users/signup',
                    {
                      email: userCredentials!.email,
                      password: userCredentials!.password,
                    },
                    { withCredentials: true }
                  )

                  console.log(response.data)

                  setStep((step: number) => step + 1)
                } else {
                  setOtpVerificationError(message)
                }
              } catch (error: any) {
                setOtpVerificationError(error.message)
              } finally {
                setLoading(false)
              }
            })}
          >
            <span className={`ml-3 text-sm font-poppins-medium text-button-radio-button`}>6 Digit OTP*</span>
            <input
              {...register('otp', {
                required: 'This field is required',
              })}
              className="w-full outline-1 outline py-4 px-5 outline-black rounded-full focus:outline-2"
              type="text"
              placeholder="Enter your OTP here"
            />
            {errors.otp && (
              <ErrorMessage text={errors.otp.message!.toString()} />
            )}

            <button
              disabled={loading}
              className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
            >
              {loading ? <BarLoader /> : 'Verify'}
            </button>
            {otpVerificationError && (
              <ErrorMessage text={otpVerificationError} />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtp
