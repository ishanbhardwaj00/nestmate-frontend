import { useContext, useEffect, useRef, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { RxDotsVertical } from 'react-icons/rx'
import { IoMdSend } from 'react-icons/io'
import useWebSocket from 'react-use-websocket'
import {
  useParams,
  useSearchParams,
  useHref,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { useForm } from 'react-hook-form'
import chatContext, { ChatContext } from '../contexts/chatContext'
import Loading from '../components/Loading'
import { MatchContext } from '../contexts/matchContext'
import axios from 'axios'
import { AuthContext } from '../contexts/authContext'

type MessageType = { type: string; message: string }
const UserChat = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const navigate = useNavigate()
  const { chats, setChats, sendJsonMessage, lastMessage, readyState } =
    useContext(ChatContext)
  const { user } = useContext(AuthContext)
  const { matches, setMatches } = useContext(MatchContext)
  const { userId } = useParams()
  const scrollRef = useRef<HTMLDivElement>()

  useEffect(() => {
    async function markAndSetReadReciepts() {
      if (chats[userId].lastMessage.sender === userId) {
        console.log('gotta mark')

        try {
          axios.post(
            'https://nestmate-backend-9f3d331450ee.herokuapp.com/api/chats/read',
            { receiver: userId },
            { withCredentials: true }
          )
        } catch (error) {
          console.log('axios bg task failed')
        }

        setChats((prevChats) => {
          let updatedChats = prevChats
          updatedChats = {
            ...updatedChats,
            [userId]: {
              ...updatedChats[userId],
              lastMessage: {
                ...updatedChats[userId].lastMessage,
                readBy: [user._id],
              },
            },
          }
          console.log(updatedChats)

          return updatedChats
        })
      }
    }
    if (chats?.[userId]) markAndSetReadReciepts()
  }, [])

  useEffect(() => {
    if (matches) {
      async function getUser() {
        const response = await axios.get(
          `https://nestmate-backend-9f3d331450ee.herokuapp.com/users/${userId}`,
          {
            withCredentials: true,
          }
        )
        setMatches((prevMatches) => {
          const updatedMatches = prevMatches

          updatedMatches[userId] = response.data.user
          return updatedMatches
        })
        console.log(response.data)
      }

      if (!matches[userId]) {
        console.log('setting')
        getUser()
      }
    }
  }, [matches])
  useEffect(() => {
    if (chats) {
      console.log(chats)
    }
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [chats])

  if (!chats || !matches || !user) return <Loading />
  return (
    <div className="flex flex-col h-screen bg-nav-light ">
      <div className="flex items-center py-3 gap-8 px-3 border border-b-2 justify-between animateChatHeader">
        <div className="flex gap-8">
          <button
            onClick={() => {
              console.log('clicked')
              navigate(-1)
            }}
          >
            <FaChevronLeft color="#232beb" size={32} />
          </button>
          <div className="flex gap-3 items-center">
            <span className="rounded-full h-14 w-14">
              <img
                src={matches[userId]?.metaDat?.image}
                className="h-full w-full object-cover rounded-full"
              />
            </span>
            <span className="capitalize text-xl font-semibold ">
              {matches[userId]?.userDetails?.fullName}
            </span>
          </div>
        </div>
        <button onClick={() => console.log('rxdots')}>
          <RxDotsVertical color="#232beb" size={32} />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col p-6 gap-4 overflow-y-scroll overflow-x-hidden"
      >
        {!chats?.[userId]?.messages ? (
          <div className="flex flex-1 justify-center fade-in-scale-up">
            <img className="w-2/3" src="/images/ice_breaking.svg" alt="" />
          </div>
        ) : (
          chats[userId]?.messages?.map((message, index) => {
            if (message?.sender === userId) {
              return (
                <span
                  key={index}
                  className="animateSenderChat self-start max-w-3/4 p-3 items-center rounded-tl-xl rounded-tr-xl rounded-br-xl bg-chat text-wrap"
                >
                  {message?.content}
                </span>
              )
            } else {
              return (
                <span
                  key={index}
                  className="animateRecieverChat self-end max-w-3/4 p-3  rounded-tl-xl items-center  rounded-tr-xl rounded-bl-xl bg-primary-light text-white text-wrap"
                >
                  {message?.content}
                </span>
              )
            }
          })
        )}
      </div>
      <div className="flex items-center px-6 pt-2 pb-6 animateRegistration">
        <form
          className="flex items-center gap-3 w-full h-10 rounded-full"
          onSubmit={handleSubmit((input) => {
            console.log(input)
            console.log(userId)

            const message = { receiver: userId, content: input.message }
            setChats((prevChats) => {
              console.log('settings chats from ', prevChats)

              const updatedChats = { ...prevChats }

              if (updatedChats[userId]) {
                // Updating existing user messages without mutating the state
                updatedChats[userId] = {
                  ...updatedChats[userId],
                  messages: [
                    ...updatedChats[userId]?.messages,
                    {
                      sender: user?._id,
                      content: input.message,
                    },
                  ],
                  lastMessage: {
                    sender: user?._id,
                    content: input.message,
                    updatedAt: Date.now(),
                  },
                }
              } else {
                console.log('first time')
                // Adding a new user with metadata and userDetails

                ///recipient data can be null be careful during pagination
                updatedChats[userId] = {
                  messages: [{ sender: user?._id, content: input.message }],
                }
              }

              console.log('set chats to', updatedChats)

              return updatedChats
            })

            sendJsonMessage({
              jsonMessage: JSON.stringify(message),
              keep: true,
            })
            reset({ message: '' })
          })}
        >
          <input
            {...register('message', { required: 'requied field' })}
            placeholder="Hey! How are you?"
            type="text"
            className="w-full h-10 rounded-full p-6 border border-solid text-lg focus:outline outline-2 outline-primary appearance-none"
          />
          <button disabled={errors.message}>
            <IoMdSend size={40} color={!errors.message ? '#232beb' : 'gray'} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserChat
