import Loading from '../components/Loading'
import { AuthContext } from '../contexts/authContext'
import { useContext, useEffect, useState } from 'react'
import Navigation from '../components/Navigation'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { MatchContext } from '../contexts/matchContext'
import { ChatContext } from '../contexts/chatContext'
import { UserContext } from '../contexts/userContext'

export default () => {
  const { authenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState(1)

  useEffect(() => {
    if (location.pathname === '/') setSelected(1)
    else if (location.pathname === '/profile') setSelected(0)
    if (location.pathname === '/chats') setSelected(3)
    if (location.pathname === '/stays') setSelected(2)
  }, [location.pathname])

  useEffect(() => {
    if (!authenticated) navigate('/')
  }, [authenticated])

  return (
    <div className="flex flex-col h-screen bg-home-light">
      {/* <Header selected={selected} /> */}
      <Outlet />
      <Navigation setSelected={setSelected} selected={selected} />
    </div>
  )
}
