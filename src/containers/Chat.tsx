import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../contexts/chatContext'
import Loading from '../components/Loading'
import { MatchContext } from '../contexts/matchContext'
import { AuthContext } from '../contexts/authContext'
import moment from 'moment'

function formatRelativeTime(relativeTime) {
  if (relativeTime === 'a few seconds ago') return 'just now'
  if (relativeTime === 'a minute ago') return '1m'
  const timeUnits = {
    second: 's',
    seconds: 's',
    minute: 'm',
    minutes: 'm',
    hour: 'h',
    hours: 'h',
    day: 'd',
    days: 'd',
    month: 'mo',
    months: 'mo',
    year: 'y',
    years: 'y',
  }

  // Match the regex to extract the number and unit
  const match = relativeTime.match(
    /(\d+)\s+(seconds?|minutes?|hours?|days?|months?|years?)/
  )

  if (match) {
    const value = match[1] // number
    const unit = match[2] // full unit (e.g., "seconds", "minute")

    return `${value} ${timeUnits[unit]}` // Convert to short form
  }

  return relativeTime // Return original if no match
}

const Chats = () => {
  const navigate = useNavigate()
  const { chats } = useContext(ChatContext)
  const { user, authLoading } = useContext(AuthContext)
  const { matches } = useContext(MatchContext)

  console.log('Chat.tsx, ', chats)

  useEffect(() => {}, [chats])
  const [sortedChats, setSortedChats] = useState([])

  // Function to sort the chats based on the last message time
  const sortChats = (chats) => {
    return Object.entries(chats).sort(
      ([senderIdA, chatA], [senderIdB, chatB]) => {
        const timeA = new Date(chatA?.lastMessage?.updatedAt).getTime()
        const timeB = new Date(chatB?.lastMessage?.updatedAt).getTime()
        return timeB - timeA // Sort in descending order (most recent first)
      }
    )
  }

  // UseEffect to set sorted chats initially and when a new message comes in
  useEffect(() => {
    if (chats) setSortedChats(sortChats(chats))
  }, [chats])
  if (!chats || !matches || !user) return <Loading />
  if (Object.values(chats).length === 0)
    return (
      <div className="flex flex-1 flex-col justify-center items-center gap-8 fade-in-scale-up bg-home-light">
        <img className="w-2/3" src="/images/no_chats.svg" alt="" />
        <button
          onClick={() => {
            navigate('/')
          }}
          className="w-3/4 rounded-full bg-button-primary py-4 text-2xl font-bold text-primary"
        >
          Find My Roommate
        </button>
      </div>
    )

  return (
    <div className="flex flex-col flex-1 gap-2 fade-in-scale-up overflow-scroll">
      <div className="flex flex-col py-7 px-7 gap-5">
        <span className="capitalize text-lg text-gray-dark font-medium">
          queued (2)
        </span>
        <div className="flex gap-4">
          <span className="border-2 border-primary solid rounded-full h-24 w-24">
            <img
              src="/images/matched_dp.jpg"
              className="h-full w-full bg-cover rounded-full"
            />
          </span>
          <span className="border-2 border-primary solid rounded-full h-24 w-24">
            <img
              src="/images/matched_dp.jpg"
              className="h-full w-full bg-cover rounded-full"
            />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <span className="capitalize text-gray-dark text-lg font-medium px-7">
          recents
        </span>
        {/* cards */}
        <div className="flex flex-col gap-2 p-1">
          {Object.entries(chats).map(([senderId, chat], index) => {
            console.log(user, chat)

            return (
              <div
                key={index}
                onClick={() => {
                  navigate(`/chats/${senderId}`)
                }}
                className="flex w-full p-1 px-7 gap-4 active:bg-slate-200 rounded-2xl items-center"
              >
                <div className="rounded-full h-20 w-20">
                  <img
                    src={matches[senderId]?.metaDat?.image}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 max-w-40 ">
                  <span className="capitalize text-lg font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                    {matches[senderId]?.userDetails?.fullName?.split(' ')[0]}
                  </span>
                  {chat?.lastMessage?.sender !== user?._id &&
                  !chat?.lastMessage?.readBy?.includes(user?._id) ? (
                    <div className="text-black font-medium w-fulltext-base truncate">
                      <span>
                        {chat?.messages.at(chat?.messages.length - 1)?.content}
                      </span>
                    </div>
                  ) : (
                    <div className="text-gray-dark flex gap-1 text-lg truncate ">
                      {chat?.lastMessage?.sender === user._id && (
                        <span>You:</span>
                      )}
                      <span className="truncate">
                        {chat?.messages.at(chat?.messages?.length - 1)?.content}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-base text-gray-dark">
                  {formatRelativeTime(
                    moment(chat?.lastMessage?.updatedAt).fromNow()
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Chats
