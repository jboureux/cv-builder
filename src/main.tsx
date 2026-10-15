import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { ConfirmProvider } from '@/components/app/ConfirmProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider delay={300}>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
        <Toaster position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
