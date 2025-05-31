import { useEffect, useState } from "react"
import { Search, Home, Plus } from "lucide-react"
import { getPhotos } from "./utils/api"

const initialData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "Mountain Sunset",
    date: "2024-03-15",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    title: "Forest Path",
    date: "2024-03-10",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    title: "Ocean Waves",
    date: "2024-03-08",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "City Lights",
    date: "2024-03-05",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    title: "Winter Lake",
    date: "2024-02-28",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    title: "Flower Garden",
    date: "2024-02-25",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    title: "Rocky Coast",
    date: "2024-02-20",
  },
]
const PhotoGallery = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [photos, setPhotos] = useState(initialData)
  // Sample photo data

  // Filter photos based on search term
  const filteredPhotos = photos.filter((photo) =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    getPhotos().then((data) => {
      console.log(data)
    })
  }, [])

  const handleAddPhoto = async () => {
    const response = await getPhotos()
    console.log(response)
    const newPhoto = {
      id: photos.length + 1,
      url: response,
      title: `New Photo ${photos.length + 1}`,
      date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    }

    setPhotos([...photos, newPhoto])
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          Photo Gallery
        </h1>

        {/* Navigation Links */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-1 text-blue-600">
            <button className="flex items-center space-x-1 hover:text-blue-800 transition-colors">
              <Home size={16} />
              <span>Home</span>
            </button>
            <span className="text-gray-400">|</span>
            <button
              className="flex items-center space-x-1 hover:text-blue-800 transition-colors"
              onClick={handleAddPhoto}
            >
              <Plus size={16} />
              <span>Add Photo</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {photo.title}
                </h3>
                <p className="text-sm text-gray-500">{photo.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredPhotos.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No photos found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoGallery
