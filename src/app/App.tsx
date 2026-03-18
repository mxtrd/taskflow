import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "@/pages/login-page"
import BoardsPage from "@/pages/boards-page"
import BoardPage from "@/pages/board-page"
import TaskPage from "@/pages/task-page"

const ProfilePage = () => <div>Profile Page</div>
const NotFoundPage = () => <div>404 Page not found</div>

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/boards" element={<BoardsPage />} />
      <Route path="/boards/:boardId" element={<BoardPage />} />
      <Route path="/boards/:boardId/tasks/:taskId" element={<TaskPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
