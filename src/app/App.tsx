import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "@/pages/login-page"
import BoardsPage from "@/pages/boards-page"
import BoardPage from "@/pages/board-page"
import TaskPage from "@/pages/task-page"
import OAuthCallbackPage from "@/pages/oauth-callback"
import RequireAuth from "./RequireAuth"
// import { useAuth } from "@/shared/hooks/useAuth"
import ProfilePage from "@/pages/profile-page"

// const ProfilePage = () => {
//   const { me, logout } = useAuth()
  
//   const handleLogout = async () => {
//     await logout()
//   }

//   return (
//     <div>
//       <h1>Profile Page</h1>
//       <p>Logged in as: {me?.login ?? 'unknown'}</p>
//       <button type='button' onClick={handleLogout}>
//         Logout
//       </button>
//     </div>
//   )
// }

const NotFoundPage = () => <div>404 Page not found</div>

const App = () => {
  return (
    <Routes>
      <Route path='/oauth2/callback' element={<OAuthCallbackPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId" element={<BoardPage />} />
        <Route path="/boards/:boardId/tasks/:taskId" element={<TaskPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/boards" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
