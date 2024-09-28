import { IoSearch } from 'react-icons/io5'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import Searchbar from '../components/Searchbar'
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StaysContext } from '../contexts/staysContext'
import Loading from '../components/Loading'

function formatNumberToIndianStyle(num) {
  const numString = num.toString()

  const [integerPart, decimalPart] = numString.split('.')

  // Use a regular expression to add commas
  const lastThreeDigits = integerPart.slice(-3)
  const otherDigits = integerPart.slice(0, -3)
  const formattedIntegerPart =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') +
    (otherDigits ? ',' : '') +
    lastThreeDigits

  // Return the formatted number
  return decimalPart
    ? `${formattedIntegerPart}.${decimalPart}`
    : formattedIntegerPart
}

const Stays = () => {
  const { stays } = useContext(StaysContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [staysArray, setStaysArray] = useState(Object.values(stays))

  const navigate = useNavigate()

  useEffect(() => {
    if (stays) {
      setStaysArray(Object.values(stays))
    } else {
      setStaysArray([])
    }
  }, [stays])
  useEffect(() => {
    console.log(searchQuery)

    if (stays) {
      setStaysArray(() => {
        const arr = Object.values(stays)
        return searchProperties(arr, searchQuery)
      })
    }
  }, [searchQuery])

  function searchProperties(properties, searchQuery) {
    return properties.filter((property) => {
      const lowerSearchQuery = searchQuery.toLowerCase()

      return (
        property.LOCALITY.toLowerCase().includes(lowerSearchQuery) ||
        property.FURNISH.toLowerCase().includes(lowerSearchQuery) ||
        property.PROPERTY_TYPE.toLowerCase().includes(lowerSearchQuery) ||
        property.PROP_HEADING.toLowerCase().includes(lowerSearchQuery) ||
        property.DESCRIPTION.toLowerCase().includes(lowerSearchQuery) ||
        property.CLASS_HEADING.toLowerCase().includes(lowerSearchQuery) ||
        (property.USPS &&
          property.USPS.some((usp) =>
            usp.toLowerCase().includes(lowerSearchQuery)
          )) ||
        property.FLOOR_NUM.toLowerCase().includes(lowerSearchQuery) ||
        property.Rent.toString().includes(lowerSearchQuery) ||
        property.BEDROOM_NUM.toLowerCase().includes(lowerSearchQuery) ||
        property.BATHROOM_NUM.toString().includes(lowerSearchQuery)
      )
    })
  }

  if (!stays) return <Loading />
  return (
    <div className="flex flex-col flex-1 p-6 overflow-scroll">
      <div className="h-16">
        <Searchbar setSearchQuery={setSearchQuery} />
      </div>
      <div className="flex flex-col flex-1 overflow-y-scroll gap-4">
        {staysArray.map((stay) => (
          <div
            key={stay?._id}
            onClick={() => {
              navigate(`/stays/${stay?._id}`)
            }}
            className="flex flex-col w-full bg-white rounded-lg shadow-lg fade-in-scale-up"
          >
            <div className="flex justify-between p-4 pb-3 items-center ">
              <span className="py-1 px-2 text-button-radio-button bg-location font-medium text-xs  rounded-full font-poppins-medium">
                {stay?.LOCALITY}
              </span>
              <span>
                <HiOutlineDotsVertical size={25} color="#232BEB" />
              </span>
            </div>
            <div className="flex">
              <img
                className="h-48 w-full object-cover"
                src={stay?.URL}
                alt=""
              />
            </div>
            <div className="flex flex-col px-4 py-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-poppins-semi">
                  INR {formatNumberToIndianStyle(stay.Rent)}
                </span>
                <span className="text-sm text-gray-400">/ month</span>
              </div>
              <div className="text-sm text-button-radio-button">
                <span>{stay?.BEDROOM_NUM} | </span>
                <span>{stay?.FURNISH} | </span>
                <span>{stay?.FLOOR_NUM} Floor</span>
              </div>
              <div className="text-sm text-button-radio-button">
                <span>{stay?.PROPERTY_TYPE}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stays
