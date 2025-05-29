const API_URL = import.meta.env.VITE_API_URL

const getAccessToken = () => {
  const sessionStorageKeys = Object.keys(sessionStorage)
  const oidcKey = sessionStorageKeys.find((key) =>
    key.startsWith("oidc.user:https://cognito-idp.")
  )
  const oidcContext =
    oidcKey === undefined
      ? {}
      : JSON.parse(sessionStorage.getItem(oidcKey) || "{}")
  const accessToken = oidcContext?.access_token
  return accessToken
}

export const deleteAccessToken = () => {
  const sessionStorageKeys = Object.keys(sessionStorage)
  const oidcKey = sessionStorageKeys.find((key) =>
    key.startsWith("oidc.user:https://cognito-idp.")
  )

  if (oidcKey !== undefined) {
    sessionStorage.removeItem(oidcKey)
  }
}

export const getPhotos = async () => {
  const response = await fetch(`${API_URL}/photos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  })
  return response.json()
}
