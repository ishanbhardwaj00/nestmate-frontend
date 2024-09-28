import { useNavigate } from 'react-router-dom'
import questionnaire from '../utils/questionnaire'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext'

const EditPreferences = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { register } = useForm({
    defaultValues: {
      nature: user?.hobbies?.nature,
      dietaryPreferences: user?.hobbies?.dietaryPreferences,
      workStyle: user?.hobbies?.workStyle,
      smokingPreference: user?.hobbies?.smokingPreference,
      drinkingPreference: user?.hobbies?.drinkingPreference,
      guestPolicy: user?.hobbies?.guestPolicy,
      workHours: user?.hobbies?.workHours,
      regionalBackground: user?.hobbies?.regionalBackground,
      interests: user?.hobbies?.interests,
    },
  })
  return (
    <div className="flex flex-1 flex-col fade-in-scale-up overflow-y-scroll gap-8 pb-10 bg-nav-light">
      <div className="flex justify-between fixed z-50 font-semibold p-6 bg-nav-light w-full ">
        <span
          onClick={() => {
            navigate(-1)
          }}
          className="text-base text-red-500"
        >
          Discard
        </span>
        <span className="text-base text-primary ">Save</span>
      </div>
      <div className="flex flex-col gap-6 w-full pl-10 pr-6">
        {questionnaire.map((question) => (
          <div key={question.id} className="flex flex-col capitalize gap-1">
            <div className="font-medium text-base">{question.heading}</div>
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
            {/* {errors[question.id] && (
                <ErrorMessage
                  text={errors[question.id!.toString()]?.message as string}
                />
              )} */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EditPreferences
