// App.js

import PhotoGallery from "./PhotoGallery"
import { useAuth } from "react-oidc-context"
import { deleteAccessToken } from "./utils/api"

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

function App() {
  const auth = useAuth()

  console.log("auth", auth)

  const signOutRedirect = () => {
    const clientId = CLIENT_ID
    const logoutUri = REDIRECT_URI
    const cognitoDomain = COGNITO_DOMAIN
    deleteAccessToken()
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`
  }

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <button onClick={() => signOutRedirect()}>Sign out</button>
        <PhotoGallery />
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  )
}

// function App() {
//   return <PhotoGallery />
// }
export default App
