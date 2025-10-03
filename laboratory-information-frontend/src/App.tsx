import { useEffect, useSyncExternalStore } from 'react'
import LoginPage from './pages/auth'
import { Admin } from './pages/roles/Admin'
import { LabManagement } from './pages/roles/LabManagement'
import { LabUser } from './pages/roles/lab/LabUser'
import { Technician } from './pages/roles/lab/Technician'
import { ServiceEngineer } from './pages/roles/lab/ServiceEngineer'
import { Patient } from './pages/roles/patient/Patient'

function useHashLocation() {
  const subscribe = (cb: () => void) => {
    window.addEventListener('hashchange', cb)
    return () => window.removeEventListener('hashchange', cb)
  }
  return useSyncExternalStore(subscribe, () => window.location.hash, () => '#')
}

function App() {
  const hash = useHashLocation()

  useEffect(() => {
    if (!hash) return
    // Fallback: ensure hash always starts with '#'
  }, [hash])

  const route = hash.replace(/^#/, '')

  if (route.startsWith('/role/admin')) return <Admin />
  if (route.startsWith('/role/lab-manager')) return <LabManagement />
  if (route.startsWith('/role/lab-user')) return <LabUser />
  if (route.startsWith('/role/technician')) return <Technician />
  if (route.startsWith('/role/service')) return <ServiceEngineer />
  if (route.startsWith('/role/patient')) return <Patient />
  if (route.startsWith('/role/user')) return <Patient />

  return <LoginPage />
}

export default App
