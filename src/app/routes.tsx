import { Navigate, createHashRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { CapacitacionesPage } from '../pages/CapacitacionesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DataTecnicaPage } from '../pages/DataTecnicaPage'
import { InstitucionalPage } from '../pages/InstitucionalPage'
import { AdminGestionCobranzasPage } from '../pages/AdminGestionCobranzasPage'
import { AdminInstitucionalPage } from '../pages/AdminInstitucionalPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { BuscarColegasPage } from '../pages/BuscarColegasPage'
import { PerfilSocioPage } from '../pages/PerfilSocioPage'
import { AdminOnlyRoute, ProtectedRoute, PublicOnlyRoute } from './routeGuards'

export const router = createHashRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { path: 'institucional', element: <InstitucionalPage /> },
      { path: 'capacitaciones', element: <CapacitacionesPage /> },
      { path: 'data-tecnica', element: <DataTecnicaPage /> },
      { path: 'perfil', element: <PerfilSocioPage /> },
      { path: 'colegas', element: <BuscarColegasPage /> },
      {
        path: 'admin',
        element: (
          <AdminOnlyRoute>
            <Navigate to="/admin/institucional" replace />
          </AdminOnlyRoute>
        ),
      },
      {
        path: 'admin/gestion-cobranzas',
        element: (
          <AdminOnlyRoute>
            <AdminGestionCobranzasPage />
          </AdminOnlyRoute>
        ),
      },
      {
        path: 'admin/institucional',
        element: (
          <AdminOnlyRoute>
            <AdminInstitucionalPage />
          </AdminOnlyRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
