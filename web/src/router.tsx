import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/login'
import Logout from './pages/auth/logout'

const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <Login />,
  },

  // Logout route
  {
    path: '/logout',
    element: <Logout />,
  },

  // Protected routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        lazy: async () => {
          const AppShell = await import('./components/app-shell')
          return { Component: AppShell.default }
        },
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/dashboard')).default,
            }),
          },

          {
            path: 'chats',
            lazy: async () => ({
              Component: (await import('@web/components/coming-soon')).default,
            }),
          },

          {
            path: 'users',
            lazy: async () => ({
              Component: (await import('@web/components/coming-soon')).default,
            }),
          },
          {
            path: 'analysis',
            lazy: async () => ({
              Component: (await import('@web/components/coming-soon')).default,
            }),
          },
          {
            path: 'extra-components',
            lazy: async () => ({
              Component: (await import('@web/pages/extra-components')).default,
            }),
          },
          {
            path: 'settings',
            lazy: async () => ({
              Component: (await import('./pages/settings')).default,
            }),
            errorElement: <GeneralError />,
            children: [
              {
                index: true,
                lazy: async () => ({
                  Component: (await import('./pages/settings/profile')).default,
                }),
              },
              {
                path: 'account',
                lazy: async () => ({
                  Component: (await import('./pages/settings/account')).default,
                }),
              },
              {
                path: 'appearance',
                lazy: async () => ({
                  Component: (await import('./pages/settings/appearance'))
                    .default,
                }),
              },
              {
                path: 'notifications',
                lazy: async () => ({
                  Component: (await import('./pages/settings/notifications'))
                    .default,
                }),
              },
              {
                path: 'display',
                lazy: async () => ({
                  Component: (await import('./pages/settings/display')).default,
                }),
              },
              {
                path: 'error-example',
                lazy: async () => ({
                  Component: (await import('./pages/settings/error-example'))
                    .default,
                }),
                errorElement: <GeneralError className='h-[50svh]' minimal />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    path: '/onboarding',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@web/pages/onboarding')).default,
        }),
      },
    ],
  },

  // Error routes
  { path: '/500', element: <GeneralError /> },
  { path: '/404', element: <NotFoundError /> },
  { path: '/503', element: <MaintenanceError /> },

  // Fallback 404 route
  { path: '*', element: <NotFoundError /> },
])

export default router
