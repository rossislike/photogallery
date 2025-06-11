export interface Photo {
  id?: string
  user: string
  url: string
  title?: string
  description?: string
  tags?: string[]
  dateAdded?: string
}

export interface PhotoUpload {
  name: string
  type: string
  file: File
}
