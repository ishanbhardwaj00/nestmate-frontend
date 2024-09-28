import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Parent from './Parent.tsx'
import Login from './containers/Login.tsx'
import Register from './containers/Register.tsx'
import AuthContextProvider from './contexts/authContext.tsx'
import ChatContextProvider from './contexts/chatContext.tsx'
import { UserContextProvider } from './contexts/userContext.tsx'
import MatchContextProvider from './contexts/matchContext.tsx'
import Main from './containers/Main.tsx'
import Chats from './containers/Chat.tsx'
import UserChat from './containers/UserChat.tsx'
import ChatContainer from './containers/ChatContainer.tsx'
import Profile from './containers/Profile.tsx'
import Stays from './containers/Stays.tsx'
import StaysContainer from './containers/StaysContainer.tsx'
import StayListing from './containers/StayListing.tsx'
import StaysContextProvider from './contexts/staysContext.tsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthContextProvider>
        <Login />
      </AuthContextProvider>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthContextProvider>
        <UserContextProvider>
          <Register />
        </UserContextProvider>
      </AuthContextProvider>
    ),
  },
  {
    path: '/',
    element: (
      <AuthContextProvider>
        <MatchContextProvider>
          <StaysContextProvider>
            <Parent />
          </StaysContextProvider>
        </MatchContextProvider>
      </AuthContextProvider>
    ),
    children: [
      {
        path: '',
        element: <Main />,
      },
      {
        path: 'stays',
        element: <StaysContainer />,
        children: [
          {
            path: '',
            element: <Stays />,
          },
          {
            path: ':stayId',
            element: <StayListing />,
          },
        ],
      },
      {
        path: 'chats',
        element: <ChatContainer />,
        children: [
          {
            path: '',
            element: <Chats />,
          },
          {
            path: ':userId',
            element: <UserChat />,
          },
        ],
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <RouterProvider router={router} />
  // </StrictMode>
)
