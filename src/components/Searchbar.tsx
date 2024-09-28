import { Dispatch, useState, SetStateAction } from 'react'
import { IoSearch } from 'react-icons/io5'

const Searchbar = ({
  setSearchQuery,
}: {
  setSearchQuery: Dispatch<SetStateAction<string>>
}) => {
  const [active, setActive] = useState(false)
  return (
    <div className="flex items-center bg-gray-200 rounded-full p-2 w-full max-w-lg mx-auto">
      <IoSearch
        color={`${active ? '#232beb' : 'gray'}`}
        className="text-2xl ml-2"
      />
      <input
        onChange={(e) => {
          setSearchQuery(e.target.value)
        }}
        type="text"
        placeholder="Search..."
        className="bg-transparent outline-none text-gray-700 w-full pl-4"
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      />
    </div>
  )
}

export default Searchbar
