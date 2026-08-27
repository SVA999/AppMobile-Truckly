import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardScreen } from './screens/dashboard/DashboardScreen'
import { FleetListScreen } from './screens/fleet/FleetListScreen'
import { TruckProfileScreen } from './screens/truck/TruckProfileScreen'
import { RegisterTruckScreen } from './screens/register/RegisterTruckScreen'
import { UpdateDocumentsScreen } from './screens/documents/UpdateDocumentsScreen'
import { RegisterDriverScreen } from './screens/driver/RegisterDriverScreen'
import { ProfileScreen } from './screens/profile/ProfileScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardScreen />} />
      <Route path="/flota" element={<FleetListScreen />} />
      <Route path="/flota/nuevo" element={<RegisterTruckScreen />} />
      <Route path="/flota/:id" element={<TruckProfileScreen />} />
      <Route path="/documentos" element={<UpdateDocumentsScreen />} />
      <Route path="/conductores/nuevo" element={<RegisterDriverScreen />} />
      <Route path="/perfil" element={<ProfileScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
