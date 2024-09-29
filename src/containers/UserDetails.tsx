import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../contexts/authContext'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { GoArrowLeft } from 'react-icons/go'
import axios from 'axios'
import { UserContext } from '../contexts/userContext'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { FaChevronLeft } from 'react-icons/fa'

export default ({ setStep }: { setStep: any }) => {
  const { userInformation } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const {} = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: userInformation.get('fullName'),
      dateOfBirth: userInformation.get('dateOfBirth'),
      pinCode: userInformation.get('pinCode'),
      gender: userInformation.get('gender'),
    },
  })

  // useEffect(() => {
  //   const token = Cookies.get('accessToken')

  //   if (!token) {
  //     navigate('/')
  //   }
  // }, [])

  console.log(userInformation)
  const navigate = useNavigate()
  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center justify-center overflow-scroll bg-bottom animateRegistration pb-8">
      <div className="w-3/4  flex flex-col justify-evenly gap-8 mt-8">
        <button
          onClick={async () => {
            const response = await axios.post(
              'https://nestmate-backend-production.up.railway.app/api/users/logout',
              {},
              { withCredentials: true }
            )
            console.log(response)

            navigate('/register')
            setStep((step: number) => step - 2)
          }}
        >
          <FaChevronLeft color="#232beb" size={24} />
        </button>
        <div
          className={`flex flex-col text-4xl font-poppins-bold text-primary `}
        >
          <span>Quick Intro!</span>
          <span>Who's Moving </span>
          <span>In?</span>
        </div>
        <form
          onSubmit={handleSubmit(async (userDetails) => {
            const { fullName, dateOfBirth, pinCode, gender } = userDetails

            userInformation.set('fullName', fullName)
            userInformation.set('dateOfBirth', dateOfBirth)
            userInformation.set('gender', gender)

            console.log(...userInformation.entries(), 'forma')

            setStep((step: number) => step + 1)
          })}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <p className="text-button-radio-button font-poppins-medium ml-2">
              Your Full Name*
            </p>
            <input
              className="w-full outline-1 outline p-4 outline-button-radio-button rounded-full focus:outline-2"
              type="text"
              {...register('fullName', {
                required: 'This field is required',
              })}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <ErrorMessage text={errors.fullName.message!.toString()} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-black font-poppins-medium ml-2">
              Your Birth Date*
            </p>
            <input
              className="w-full outline-1 outline p-4 text-black outline-button-radio-button rounded-full focus:outline-1"
              type="date"
              {...register('dateOfBirth', {
                required: 'Date is required',
                validate: (value: any) => {
                  const dob = new Date(value)
                  const today = new Date()
                  const age = today.getFullYear() - dob.getFullYear()
                  const hasBirthdayOccurred =
                    today.getMonth() > dob.getMonth() ||
                    (today.getMonth() === dob.getMonth() &&
                      today.getDate() >= dob.getDate())

                  const validAge = hasBirthdayOccurred ? age : age - 1

                  if (validAge < 15 || validAge > 65) {
                    return 'You must be between 15 and 65 years old.'
                  }
                  return true
                },
              })}
            />
            {errors.dateOfBirth && (
              <ErrorMessage text={errors.dateOfBirth.message!.toString()} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-button-radio-button font-poppins-medium ml-2">
              Your Pincode*
            </p>
            <input
              className="w-full outline-1 outline p-4 text-button-radio-button outline-button-radio-button rounded-full focus:outline-1"
              type="text"
              placeholder="110065"
              {...register('pinCode', {
                required: 'Date is required',
                valueAsNumber: true,
                validate: async (data) => {
                  const response = await axios.get(
                    `https://api.postalpincode.in/pincode/${data}`
                  )
                  console.log(response.data)

                  const locationData = response.data
                  if (!locationData[0].PostOffice) {
                    return 'Invalid Pincode'
                  }
                  const city =
                    locationData[0].PostOffice[0].District +
                    ', ' +
                    locationData[0].PostOffice[0].State
                  console.log(city)

                  userInformation.set('location', city)
                  return true
                },
              })}
            />
            {errors.pinCode && (
              <ErrorMessage text={errors.pinCode.message!.toString()} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-button-radio-button font-poppins-medium ml-2">
              What's your gender?
            </p>
            <div className="flex flex-col gap-2">
              {['Male', 'Female', 'Other'].map((gender) => (
                <label
                  key={gender}
                  htmlFor={gender}
                  className="flex py-3 px-4 bg-button-radio w-full justify-between rounded-full text-button-radio-button"
                >
                  <span className="text-button-radio-button text-sm">
                    {gender}
                  </span>
                  <input
                    className="rounded-full w-5 h-5 outline-none border-primary"
                    {...register('gender', {
                      required: 'This field is required',
                    })}
                    type="radio"
                    name="gender"
                    value={gender}
                    id={gender}
                  />
                </label>
              ))}
              {errors.gender && (
                <ErrorMessage text={errors.gender?.message!.toString()} />
              )}
            </div>
          </div>
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-4">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}
