import { Photo } from "../types/types"
import { Calendar, Tag } from "lucide-react"

export interface IPhotoCardProps {
  photo: Photo
}

export function PhotoCard({ photo }: IPhotoCardProps) {
  return (
    <div
      key={photo.id}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        {photo.url && (
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
          {photo.title}
        </h3>

        {photo.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {photo.description}
          </p>
        )}

        {photo.tags?.length && (
          <div className="flex flex-wrap gap-1 mb-3">
            {photo.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center text-gray-500 text-xs">
          <Calendar size={12} className="mr-1" />
          {photo.dateAdded}
        </div>
      </div>
    </div>
  )
}
