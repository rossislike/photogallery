import { Camera, X } from "lucide-react"
import { useState } from "react"
import { Photo, PhotoUpload } from "../types/types"
import { uploadPhoto } from "../utils/api"

const initialInputData = {
  url: "",
  title: "",
  description: "",
  tags: "",
}
export interface IAddPhotoFormProps {
  onCancel: () => void
  photos: Photo[]
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>
}

export function AddPhotoForm({
  onCancel,
  photos,
  setPhotos,
}: IAddPhotoFormProps) {
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newPhoto, setNewPhoto] = useState(initialInputData)
  const [photoUpload, setPhotoUpload] = useState<PhotoUpload | undefined>(
    undefined
  )

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()

      reader.onload = () => {
        console.log(file)
        setPhotoUpload({
          name: file.name,
          // imageData: e.target?.result as string,
          type: file.type,
          file,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhoto.title || !photoUpload) {
      alert("Please fill in all required fields.")
      return
    }

    uploadPhoto(photoUpload).then((data) => {
      console.log(data)
    })

    const photo: Photo = {
      id: photos.length + 1,
      title: newPhoto.title,
      description: newPhoto.description,
      tags: newPhoto.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag),
      url: newPhoto.url,
      dateAdded: new Date().toISOString().split("T")[0],
    }
    setPhotos((prev) => [photo, ...prev])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Photo</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Title *
            </label>
            <input
              type="text"
              value={newPhoto.title}
              onChange={(e) =>
                setNewPhoto((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter photo title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newPhoto.description}
              onChange={(e) =>
                setNewPhoto((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your photo"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={newPhoto.tags}
              onChange={(e) =>
                setNewPhoto((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="Enter tags separated by commas (e.g., nature, sunset, mountains)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewPhoto((prev) => ({ ...prev, url: "" }))
                        setImagePreview("")
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageInput}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageInput}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    required
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    Choose an image file
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              Add Photo
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
