import { useState } from 'react'
import { useForm } from 'react-hook-form'
import AadharValidator from 'aadhaar-validator'
import { GoArrowLeft } from 'react-icons/go'
import { BarLoader } from 'react-spinners'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { useNavigate } from 'react-router-dom'
import { BiChevronLeft } from 'react-icons/bi'
import { FaChevronLeft } from 'react-icons/fa'

export default ({ setStep }: { setStep: any }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  if (loading) return <Loading />
  return (
    <div className="flex flex-col items-center bg-step1 bg-contain bg-no-repeat dvh bg-bottom ">
      <div className="w-3/4 flex flex-col justify-start mt-10 gap-12 animateRegistration">
        <button onClick={() => navigate('/')}>
          <FaChevronLeft color="#232beb" size={24} />
        </button>
        <div
          className={`flex flex-col text-4xl font-poppins-bold text-primary `}
        >
          <span>Let's Keep It</span>
          <span>Real,</span>
          <span>Verify With,</span>
          <span>Aadhar</span>
        </div>
        <div className={`flex flex-col gap-4`}>
          <form
            autoComplete="off"
            className="flex flex-col gap-3"
            onSubmit={handleSubmit((data) => {
              console.log(data)
              setLoading(true)
              setStep((step: number) => step + 1)
              setLoading(false)
            })}
          >
            <span
              className={`ml-3 text-sm text-button-radio-button font-poppins-medium`}
            >
              Enter your Aadhar Number*
            </span>
            <input
              {...register('aadharNumber', {
                required: 'This field is required',
                minLength: {
                  value: 12,
                  message: 'Length cannot be lesser than 12',
                },
                maxLength: {
                  value: 12,
                  message: 'Length cannot be more than 12',
                },
                validate: (data) => {
                  return (
                    AadharValidator.isValidNumber(data) ||
                    'Invalid Aadhar Number'
                  )
                },
              })}
              className="w-full outline-1 outline py-4 px-5 outline-button-radio-button rounded-full focus:outline-2"
              type="text"
              placeholder="XXXX-XXXX-XXXX"
              defaultValue="277463499620"
            />
            {errors.aadharNumber && (
              <ErrorMessage text={errors.aadharNumber.message!.toString()} />
            )}
            <button
              disabled={loading}
              className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
            >
              {loading ? <BarLoader /> : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
