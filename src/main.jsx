import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-ext-400.css'
import App from './App.jsx'
import ContentProvider from './content/ContentProvider.jsx'
import { JsonContentSource } from './content/content-loader.js'
import { MotionProvider } from './animations/motion.jsx'
import './styles/tokens.css'
import './styles/globals.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing application root')
const source = new JsonContentSource(window.__SPARKBYTE_RUNTIME__?.contentUrl)
createRoot(root).render(
  <StrictMode>
    <ContentProvider source={source}>
      <MotionProvider>
        <App />
      </MotionProvider>
    </ContentProvider>
  </StrictMode>,
)
