'use client'

import { BarLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div className="flex flex-1 justify-center items-center">
      <BarLoader />
    </div>
  )
}

export default Loading
