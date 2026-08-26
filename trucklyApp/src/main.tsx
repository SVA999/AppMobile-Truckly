import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
=======
import { HashRouter } from 'react-router-dom'

// Fuente empaquetada localmente: la app no descarga nada en tiempo de ejecución.
import '@fontsource/inter/400.css'
import '@fontsource/inter/400-italic.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import './styles/global.css'
import App from './App'
import { FleetProvider } from './data/FleetProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* HashRouter para que funcione al abrir el build desde file:// o en un WebView */}
    <HashRouter>
      <FleetProvider>
        <App />
      </FleetProvider>
    </HashRouter>
>>>>>>> origin/dev2
  </StrictMode>,
)
