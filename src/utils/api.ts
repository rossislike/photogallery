const API_URL = import.meta.env.VITE_API_URL

export const getPhotos = async () => {
  const response = await fetch(`${API_URL}/photos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.json()
}
