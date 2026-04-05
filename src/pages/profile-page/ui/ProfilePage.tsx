import { useAuth } from "@/shared/hooks/useAuth"

const ProfilePage = () => {
  const { me, logout } = useAuth()
  
  const handleLogout = async () => {
    await logout()
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Logged in as: {me?.login ?? 'unknown'}</p>
      <button type='button' onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default ProfilePage