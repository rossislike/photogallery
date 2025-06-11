import { useEffect, useState } from "react"
import { Plus, Camera } from "lucide-react"
import { Photo } from "../types/types"
import { PhotoCard } from "./PhotoCard"
import { AddPhotoForm } from "./AddPhotoForm"
import { getPhotos } from "../utils/api"
import { useAuth } from "react-oidc-context"

const initialPhotos = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "Mountain Sunset",
    date: "2024-03-15",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    title: "Forest Path",
    date: "2024-03-10",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    title: "Ocean Waves",
    date: "2024-03-08",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "City Lights",
    date: "2024-03-05",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "Winter Lake",
    date: "2024-02-28",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    title: "Flower Garden",
    date: "2024-02-25",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    title: "Rocky Coast",
    date: "2024-02-20",
  },
]

const PhotoGallery = () => {
  // const [searchTerm, setSearchTerm] = useState("")
  const [photos, setPhotos] = useState<Photo[]>(
    initialPhotos.map((p) => ({ ...p, user: "system" }))
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const auth = useAuth()
  // Sample photo data

  // Filter photos based on search term
  // const filteredPhotos = photos.filter((photo) =>
  //   photo.title?.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  useEffect(() => {
    async function fetchPhotos() {
      const data = await getPhotos(auth.user?.profile.email)
      setPhotos([...photos, ...data])
    }
    fetchPhotos()
  }, [])

  const handleCancel = () => {
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Photo Gallery</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Add Photo
          </button>
        </div>

        {showAddForm && (
          <AddPhotoForm
            onCancel={handleCancel}
            photos={photos}
            setPhotos={setPhotos}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo: Photo) => (
            <PhotoCard photo={photo} key={photo.id} />
          ))}
        </div>

        {photos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No photos yet
            </h3>
            <p className="text-gray-500">
              Add your first photo to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoGallery
