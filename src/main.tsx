import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/authContext.tsx';
import SocketContextProvider from './context/socketContext.tsx'
import { ThemeProvider } from './context/themeContext.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketContextProvider>
          <ThemeProvider>
            <App></App>
          </ThemeProvider>



        </SocketContextProvider>


      </AuthProvider>

    </BrowserRouter>
  </StrictMode>,
)
