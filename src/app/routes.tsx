import { Navigate, createHashRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { CapacitacionesPage } from '../pages/CapacitacionesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DataTecnicaPage } from '../pages/DataTecnicaPage'
import { InstitucionalPage } from '../pages/InstitucionalPage'
import { AdminCuotasPage } from '../pages/AdminCuotasPage'
import { AdminGestionCobranzasPage } from '../pages/AdminGestionCobranzasPage'
import { AdminInstitucionalPage } from '../pages/AdminInstitucionalPage'
import { AdminSitioWebPage } from '../pages/AdminSitioWebPage'
import { AdminSitioWebPortadaPage } from '../pages/AdminSitioWebPortadaPage'
import { AdminSitioWebServiciosPage } from '../pages/AdminSitioWebServiciosPage'
import { AdminSitioWebFooterPage } from '../pages/AdminSitioWebFooterPage'
import { AdminSitioWebContactoRedesPage } from '../pages/AdminSitioWebContactoRedesPage'
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
        path: 'admin/cuotas',
        element: (
          <AdminOnlyRoute>
            <AdminCuotasPage />
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
      {
        path: 'admin/sitio-web',
        element: (
          <AdminOnlyRoute>
            <AdminSitioWebPage />
          </AdminOnlyRoute>
        ),
      },
      {
        path: 'admin/sitio-web/portada',
        element: (
          <AdminOnlyRoute>
            <AdminSitioWebPortadaPage />
          </AdminOnlyRoute>
        ),
      },
      {
        path: 'admin/sitio-web/servicios',
        element: (
          <AdminOnlyRoute>
            <AdminSitioWebServiciosPage />
          </AdminOnlyRoute>
        ),
      },
      {
        path: 'admin/sitio-web/footer',
        element: (
          <AdminOnlyRoute>
            <AdminSitioWebFooterPage />
          </AdminOnlyRoute>
        ),
      },
      {
        path: 'admin/sitio-web/contacto-redes',
        element: (
          <AdminOnlyRoute>
            <AdminSitioWebContactoRedesPage />
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
