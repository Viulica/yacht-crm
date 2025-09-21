import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BoatFormData, ImageFile } from '@/lib/schemas/boat'

export function useBoatForm() {
  const [formData, setFormData] = useState<BoatFormData>({
    model: '',
    brand: '',
    year: '',
    size: '',
    price: '',
    currency: 'EUR',
    location: '',
    description: '',
    equipment: '',
    owner: '',
    engine: '',
    engineHours: ''
  })
  
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileSelect = (files: FileList) => {
    const newImages: ImageFile[] = []
    
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB')
        return
      }
      
      const imageFile: ImageFile = {
        file,
        preview: URL.createObjectURL(file),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      
      newImages.push(imageFile)
    })
    
    setImages(prev => [...prev, ...newImages])
    setError('')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      // Clean up object URL
      const toRemove = prev.find(img => img.id === id)
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview)
      }
      return updated
    })
  }

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []
    
    const uploadedUrls: string[] = []
    
    for (const image of images) {
      const formData = new FormData()
      formData.append('image', image.file)
      
      try {
        setUploadProgress(prev => ({ ...prev, [image.id]: 0 }))
        
        const response = await fetch('/api/boats/images', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          throw new Error('Failed to upload image')
        }
        
        const data = await response.json()
        uploadedUrls.push(data.url)
        setUploadProgress(prev => ({ ...prev, [image.id]: 100 }))
        
      } catch (error) {
        console.error('Error uploading image:', error)
        throw new Error(`Failed to upload image: ${image.file.name}`)
      }
    }
    
    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const imageUrls = await uploadImages()
      
      const response = await fetch('/api/boats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create boat')
        setIsLoading(false)
        return
      }

      images.forEach(img => URL.revokeObjectURL(img.preview))
      
      router.push('/dashboard/boats')
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return {
    formData,
    images,
    isDragOver,
    uploadProgress,
    isLoading,
    error,
    handleChange,
    handleSelectChange,
    handleFileSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    handleSubmit
  }
}
