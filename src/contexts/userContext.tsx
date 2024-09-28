import { createContext, useRef, MutableRefObject } from 'react'

export const UserContext = createContext({
  userInformation: new FormData(),
})

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const userInformation = new FormData()
  return (
    <UserContext.Provider value={{ userInformation }}>
      {children}
    </UserContext.Provider>
  )
}
