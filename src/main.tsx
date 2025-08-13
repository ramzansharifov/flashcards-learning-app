import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Header } from './components/layout/Header.tsx'
import { Footer } from './components/layout/Footer.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <div className='min-h-dvh grid grid-rows-[auto_1fr_auto]'>
          <Header />
          <App />
          <Footer />
        </div>
      </BrowserRouter>
    </UserProvider>
  </StrictMode >,
)
