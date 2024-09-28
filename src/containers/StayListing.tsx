import { useContext, useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { StaysContext } from '../contexts/staysContext'
import Loading from '../components/Loading'
import { IoMdCall } from 'react-icons/io'
const StayListing = () => {
  const navigate = useNavigate()
  const { stays } = useContext(StaysContext)
  const { stayId } = useParams()
  const [stay, setStay] = useState(null)
  useEffect(() => {
    if (stays) setStay(stays[stayId])
  }, [stays])
  if (!stays || !stay) return <Loading />
  return (
    <div className="flex flex-col text-button-radio-button overflow-y-scroll fade-in-scale-up">
      <div className="relative ">
        <img
          className="h-80 w-full object-cover rounded-bl-2xl rounded-b-2xl"
          src={stay.URL}
          alt=""
        />
        <div
          onClick={() => {
            navigate(-1)
          }}
          className="flex items-center absolute top-4  left-6 p-2 bg-white rounded-full"
        >
          <FaChevronLeft color="#232beb" size={32} />
        </div>
      </div>
      <div className="flex flex-col px-6 py-3 gap-8">
        <div className="flex items-center gap-1 capitalize text-xs text-button-radio-button font-poppins-light">
          <span>Posted By</span>
          <span>
            <img
              className="h-5 w-5 rounded-full "
              src="/images/blank.png"
              alt=""
            />
          </span>
          <span className="text-xs font-">{stay?.CLASS_HEADING}</span>
        </div>
        <span className="text-2xl font-poppins-semi leading-7">
          {stay.PROP_HEADING}
        </span>
        <table className="table-auto text-sm w-full border-collapse">
          <tbody>
            <tr>
              <td className="border px-4 py-2 font-poppins-medium">Location</td>
              <td className="border px-4 py-2 capitalize">{stay.LOCALITY}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-poppins-medium">
                {stay.PROPERTY_TYPE}
              </td>
              <td className="border px-4 py-2">Residential</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-poppins-medium">Rent</td>
              <td className="border px-4 py-2">Rs. {stay.Rent} Per Month</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-poppins-medium">Near</td>
              <td className="border px-4 py-2 capitalize">
                {stay.NEAR[0]?.replace('Near', '').trim()}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-poppins-medium">Rooms</td>
              <td className="border px-4 py-2">{stay.BEDROOM_NUM}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2 font-poppins-medium">
                Bathrooms
              </td>
              <td className="border px-4 py-2">{stay.BATHROOM_NUM}</td>
            </tr>
          </tbody>
        </table>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-poppins-semi ">Description</span>
          <span className="font-poppins-light">{stay.DESCRIPTION}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-poppins-semi ">Amenties</span>
          <div className="flex flex-wrap gap-2">
            {stay?.USPS.map((amenity, ind) => {
              return (
                <span
                  key={ind}
                  className="py-2 px-4 border border-black border-solid max-w-max rounded-full text-center"
                >
                  {amenity}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex justify-center">
          <a
            href="tel:+1234567890"
            className="max-w-fit  px-10 py-3 flex items-center gap-2 rounded-full bg-button-primary text-2xl font-bold text-primary mx-auto"
          >
            <IoMdCall size={28} color="#232beb" />
            Call
          </a>
        </div>
      </div>
    </div>
  )
}

export default StayListing
