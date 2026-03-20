import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// import { StrictMode } from 'react'
import { BoardsProvider } from './shared/contexts/BoardsContext'
import { TasksProvider } from './shared/contexts/TasksContext'
import App from '@/app'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <BoardsProvider>
      <TasksProvider>
        <App />
      </TasksProvider>
    </BoardsProvider>
  </BrowserRouter>,
)
