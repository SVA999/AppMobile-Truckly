import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La app es 100% offline: todo el JS, CSS, fuentes e iconos se empaquetan en el
// bundle. HashRouter + localStorage; sin llamadas de red.
// base: './' -> rutas de assets relativas para que el build funcione desde
// file:// y dentro del wrapper del instalador.
export default defineConfig({
  base: './',
  plugins: [react()],
})
