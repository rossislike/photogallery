const API_BASE_URL = import.meta.env.VITE_API_URL

export const getPhotos = async () => {
  const response = await fetch(`${API_BASE_URL}/photos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.json()
}
