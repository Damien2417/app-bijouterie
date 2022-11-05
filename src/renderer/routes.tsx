import { useNavigate, Route, Routes } from 'react-router-dom'

import { MainScreen, StockScreen, ClientScreen, VenteScreen, AnotherScreen } from 'renderer/screens'
import { SideBar } from 'renderer/components'

export function AppRoutes() {
  return (
      <>
        <SideBar navigate={useNavigate()}></SideBar>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/stock" element={<StockScreen />} />
          <Route path="/clients" element={<ClientScreen />} />
          <Route path="/ventes" element={<VenteScreen />} />
          <Route path="/anotherScreen" element={<AnotherScreen />} />
        </Routes>
      </>
  )
}
