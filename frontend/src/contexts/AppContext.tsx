/* eslint-disable */
import React, { createContext, useContext, useState } from "react";

export const AppContext = createContext<any>({img: '', setImg: ''})

export function AppContextProvider({children}: {children: React.ReactNode}) {
  const [img, setImg] = useState('')

  return (
    <AppContext.Provider value={{img, setImg}}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const {img, setImg} = useContext(AppContext)
  return {img, setImg}
}