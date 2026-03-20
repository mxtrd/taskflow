import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import { StrictMode } from 'react'
import { BoardsProvider } from './shared/contexts/BoardsContext'
import App from '@/app'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <BoardsProvider>
      <App />
    </BoardsProvider>
  </BrowserRouter>,
)
