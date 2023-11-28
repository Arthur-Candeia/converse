import { RouterProvider } from "react-router-dom"
import router from "./router"
import { AppContextProvider } from "./contexts/AppContext"

function App() {

  return (
    <main>
      <AppContextProvider>
        <RouterProvider router={router}/>
      </AppContextProvider>
    </main>
  )
}

export default App
