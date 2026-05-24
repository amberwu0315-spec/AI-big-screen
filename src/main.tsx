import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { BrowserRouter } from 'react-router-dom'
import '@mantine/core/styles.layer.css'
import './index.css'
import App from './App.tsx'
import { AppLocaleProvider } from '@/components/layout/app-locale-provider'

createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <AppLocaleProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppLocaleProvider>
  </MantineProvider>,
)
