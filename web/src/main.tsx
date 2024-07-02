import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@web/components/ui/toaster'
import { ThemeProvider } from '@web/components/theme-provider'
import router from '@web/router'
import '@shared/theme.css'
import '@web/styles/tailwind.css'
import '@web/index.css'

import { OfflineProvider } from '@shared/providers/OfflineProvider'
import { AuthProvider } from '@shared/providers/AuthProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <OfflineProvider>
    <AuthProvider>
      <React.StrictMode>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </React.StrictMode>
    </AuthProvider>
  </OfflineProvider>
)
