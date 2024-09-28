import { Link } from 'react-router-dom'

const Landing = () => {
  console.log('Landing')

  return (
    <div className="flex flex-col dvh bg-primary bg-custom-pattern bg-no-repeat bg-center bg-cover w-full items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <img className="w-full" src="/images/logo-text.svg" alt="homigo-logo" />
      </div>
      <div className={`flex flex-col w-4/5 gap-3`}>
        <div
          className={`flex flex-col p-4 text-4xl font-extrabold text-shadow-outline text-white drop-shadow-xl`}
        >
          <span>Your </span>
          <span>Roommate</span>
          <span>Journey Starts</span>
          <span>Here!</span>
        </div>
        <Link
          to="/login"
          className="p-4 w-full outline outline-1 outline-white text-xl rounded-full text-center text-white font-poppins-medium"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="p-4 w-full outline outline-1 text-xl outline-white rounded-full text-center bg-white text-primary font-poppins-medium"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default Landing
