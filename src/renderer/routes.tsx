import { useNavigate, Route, Routes } from 'react-router-dom'

import { MainScreen, AnotherScreen, ClientScreen } from 'renderer/screens'
import { SideBar } from 'renderer/components'

export function AppRoutes() {
  return (
      <>
        <SideBar navigate={useNavigate()}></SideBar>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/anotherScreen" element={<AnotherScreen />} />
          <Route path="/clients" element={<ClientScreen />} />
        </Routes>
      </>
  )
}
