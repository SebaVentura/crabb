import { Navigate, createHashRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { CapacitacionesPage } from '../pages/CapacitacionesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DataTecnicaPage } from '../pages/DataTecnicaPage'
import { InstitucionalPage } from '../pages/InstitucionalPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { PerfilSocioPage } from '../pages/PerfilSocioPage'

export const router = createHashRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <AppShell />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: 'institucional', element: <InstitucionalPage /> },
      { path: 'capacitaciones', element: <CapacitacionesPage /> },
      { path: 'data-tecnica', element: <DataTecnicaPage /> },
      { path: 'perfil', element: <PerfilSocioPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
