import { PhotoUpload } from "../types/types"

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

export const getPhotos = async (user: string | undefined) => {
  if (user === undefined) return []
  const response = await fetch(
    `${API_URL}/photos?user=${encodeURIComponent(user)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    }
  )
  return response.json()
}

export const uploadPhoto = async ({
  name: fileName,
  type,
  file,
}: PhotoUpload) => {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ fileName }),
  })

  const { uploadUrl, key, imageId } = await response.json()
  console.log("uploadUrl, key, imageId", uploadUrl, key, imageId)

  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": type,
    },
    body: file,
  })
  return { key, imageId }
}
