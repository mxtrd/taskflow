import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { BoardsProvider } from './shared/contexts/BoardsContext'
import { TasksProvider } from './shared/contexts/TasksContext'
import { AuthProvider } from '@/shared/contexts/AuthContext'
import { store } from '@/app/store/store'
import App from '@/app'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Provider store={store}>
      <AuthProvider>
        <BoardsProvider>
          <TasksProvider>
            <App />
          </TasksProvider>
        </BoardsProvider>
      </AuthProvider>
    </Provider>
  </BrowserRouter>
)