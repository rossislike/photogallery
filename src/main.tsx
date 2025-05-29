import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { AuthProvider } from "react-oidc-context"
import { Route, BrowserRouter, Routes } from "react-router-dom"

const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${USER_POOL_ID}`,
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  response_type: "code",
  scope: "email openid phone",
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider {...cognitoAuthConfig}>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)
