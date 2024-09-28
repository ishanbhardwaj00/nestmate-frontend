import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/authContext'
import calculateAge from '../utils/calculateAge'
import { BiSolidPencil } from 'react-icons/bi'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Loading from '../components/Loading'
import EditPreferences from './EditPreferences'
import axios from 'axios'

const Profile = () => {
  const { user, setAuthenticated } = useContext(AuthContext)
  const { register } = useForm({
    defaultValues: {
      bio: user?.metaDat?.bio,
      monthlyRentPreferences: user?.metaDat?.monthlyRent,
    },
  })

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  useEffect(() => {}, [searchParams, user])

  const [image, setImage] = useState(user?.metaDat?.image)

  const settings = [
    {
      name: 'Account Settings',
      color: 'text-radio-button',
      onClick: () => {},
    },
    {
      name: 'Privacy Policy',
      color: 'text-radio-button',
      onClick: () => {},
    },
    {
      name: 'Terms & Conditions',
      color: 'text-radio-button',
      onClick: () => {},
    },
    {
      name: 'Log out',
      color: 'text-radio-button',
      onClick: async () => {
        try {
          const response = await axios.get(
            'https://nestmate-backend-production.up.railway.app/api/users/logout',
            { withCredentials: true }
          )
          setAuthenticated(false)
        } catch (error) {
          console.log(error)
        }
      },
    },
    {
      name: 'Delete Account',
      color: 'text-red-400',
      onClick: () => {},
    },
  ]

  if (searchParams.get('edit') === 'true') {
    return <EditPreferences />
  } else if (!user) return <Loading />

  if (!user) return <Loading />
  return (
    <div className="flex flex-col flex-1 gap-6 bg-nav-light fade-in-scale-up px-8 pb-4 overflow-y-scroll">
      <div className="flex flex-row-reverse h-10">
        <button
          onClick={() => {
            console.log('welcome')
          }}
          className="text-base text-primary-light font-poppins-semi py-3"
        >
          Save
        </button>
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div className="relative h-44 w-44 bg-black rounded-full border-primary border-2">
          <label htmlFor="fileInput">
            <img
              className="w-full h-full rounded-full object-cover"
              src={image}
              alt="pfp.jpg"
            />
            <div className="absolute flex items-center justify-center right-0 bottom-3 h-8 w-8 bg-primary border-2 border-white rounded-full">
              <BiSolidPencil size={22} color="white" />
            </div>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files![0]
              if (file) {
                const imageUrl = URL.createObjectURL(file)
                setImage(imageUrl)
              }
            }}
          />
        </div>
        <div className="text-2xl font-poppins-semi">
          <span className="">{user?.userDetails?.fullName?.split(' ')[0]}</span>
          <span className="">
            , {calculateAge(user?.userDetails?.dateOfBirth)}
          </span>
        </div>
        <button
          onClick={() => {
            navigate('/profile?edit=true')
          }}
          className="rounded-full bg-button-primary py-2 px-5 text-sm font-medium text-primary"
        >
          Edit Profile
        </button>
      </div>
      <div className="flex flex-col items-center">
        <form className="w-full flex gap-7 flex-col">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <span className="text-base font-poppins-medium text-button-radio-button ml-3">
                Bio
              </span>
              <span>
                <BiSolidPencil color="gray" size={18} />
              </span>
            </div>
            <textarea
              {...register('bio', {
                required: 'This field is required',
              })}
              className="w-full h-36 border rounded-3xl px-5 py-3 text-sm border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Tell us about you – your vibe, your quirks, and what makes you a great roommate!"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-base font-poppins-medium text-button-radio-button ml-3">
              Monthly Rent Preferences*
            </p>
            <input
              {...register('monthlyRentPreferences', {
                required: 'This field is required',
                validate: (data) => {
                  return !isNaN(data) || 'Should be a number'
                },
              })}
              className="w-full border rounded-3xl py-3 px-5 text-sm border-button-radio-button focus:border-blue-500 active:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Enter A Number"
            />
            {/* {errors.monthlyRentPreferences && (
              <ErrorMessage
                text={errors.monthlyRentPreferences.message!.toString()}
              />
            )} */}
          </div>
        </form>
      </div>
      <div className="flex flex-col gap-4 ml-2 mt-2">
        {settings.map((setting) => (
          <div
            key={setting.name}
            onClick={setting.onClick}
            className={`${setting?.color} font-poppins-medium text-sm`}
          >
            {setting.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
