import { useState, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { GoArrowLeft } from 'react-icons/go'
import { UserContext } from '../contexts/userContext'
import questionnaire from '../utils/questionnaire'

export default ({ setStep }: { setStep: any }) => {
  const { userInformation } = useContext(UserContext)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nature: userInformation.get('nature'),
      dietaryPreferences: userInformation.get('dietaryPreferences'),
      workStyle: userInformation.get('workStyle'),
      smokingPreference: userInformation.get('smokingPreference'),
      drinkingPreference: userInformation.get('drinkingPreference'),
      guestPolicy: userInformation.get('guestPolicy'),
      workHours: userInformation.get('workHours'),
      regionalBackground: userInformation.get('regionalBackground'),
      interests: JSON.parse(userInformation.get('interests')),
    },
  })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (userInformation) {
      reset()
    }
  }, [])
  return (
    // <div className="flex flex-col items-center justify-center bg-custom-pattern bg-no-repeat bg-center bg-cover animateRegistration overflow-scroll">
    <div className="flex flex-col items-center justify-center  animateRegistration overflow-scroll">
      <div className="w-3/4  py-16 flex flex-col justify-between gap-8">
        <button onClick={() => setStep((step: any) => step - 1)}>
          <GoArrowLeft size={24} />
        </button>
        <div className="flex flex-col gap-2">
          <div className={`flex flex-col text-4xl font-bold text-primary `}>
            <span>Let's Get To</span>
            <span>Know You A</span>
            <span>Liiittle Better...</span>
          </div>
          <p className="text-primary font-light text-sm">
            Let's learn about your lifestyle & hobbies to find your best match
          </p>
        </div>
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit((hobbies) => {
            setLoading(true)
            console.log(hobbies)
            userInformation.set(
              'dietaryPreferences',
              hobbies.dietaryPreferences
            )
            userInformation.set(
              'drinkingPreference',
              hobbies.drinkingPreference
            )
            userInformation.set('guestPolicy', hobbies.guestPolicy)
            userInformation.set('interests', JSON.stringify(hobbies.interests))
            userInformation.set('nature', hobbies.nature)
            userInformation.set(
              'regionalBackground',
              hobbies.regionalBackground
            )
            userInformation.set('smokingPreference', hobbies.smokingPreference)
            userInformation.set('workHours', hobbies.workHours)
            userInformation.set('workStyle', hobbies.workStyle)

            setStep((step: number) => step + 1)
            setTimeout(() => {}, 300)
            setLoading(false)
            console.log(...userInformation.entries())
          })}
        >
          {questionnaire.map((question) => (
            <div key={question.id} className="flex flex-col capitalize gap-1">
              <span className="font-semibold text-base">
                {question.heading}
              </span>
              <div className="flex flex-row gap-2 align items-start flex-wrap">
                {question.options.map((option, index) => (
                  <label
                    key={option}
                    className="flex text-sm items-center py-2 px-3 border-solid border border-black rounded-full has-[:checked]:bg-button-primary has-[:checked]:border-button-primary"
                    htmlFor={option}
                  >
                    <span className="w-max">{option}</span>
                    <input
                      {...register(`${question.id}`, {
                        required: 'This field is required',
                      })}
                      className="hidden"
                      type={question.type}
                      value={option}
                      name={question.id}
                      id={option}
                    />
                  </label>
                ))}
              </div>
              {errors[question.id] && (
                <ErrorMessage
                  text={errors[question.id!.toString()]?.message as string}
                />
              )}
            </div>
          ))}
          <button className="w-full rounded-full bg-button-primary py-4 text-2xl font-bold text-primary mt-6">
            Next
          </button>
        </form>
      </div>
    </div>
  )
}
