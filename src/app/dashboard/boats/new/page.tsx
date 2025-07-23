"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ImageFile {
  file: File
  preview: string
  id: string
}

export default function NewBoat() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    year: '',
    length: '',
    price: '',
    currency: 'EUR',
    location: '',
    manufacturer: '',
    condition: '',
    description: '',
    features: ''
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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return
      }
      
      // Validate file size (max 10MB)
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
      // First upload images
      const imageUrls = await uploadImages()
      
      // Then create boat with image URLs
      const response = await fetch('/api/boats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrls // Add image URLs to boat data
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create boat')
        setIsLoading(false)
        return
      }

      // Clean up object URLs
      images.forEach(img => URL.revokeObjectURL(img.preview))
      
      router.push('/dashboard/boats')
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--white)',
    border: '2px solid var(--gray-200)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '400',
    transition: 'all 0.3s ease'
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--accent-gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--gray-200)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
      {/* Header */}
      <header style={{ 
        background: 'var(--white)', 
        borderBottom: '1px solid var(--gray-200)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <div className="yacht-container">
          <div className="yacht-flex-between py-6">
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <h1 style={{ 
                fontSize: '28px',
                fontWeight: '300',
                color: '#374151',
                letterSpacing: '0.5px',
                margin: 0
              }}>
                Yacht CRM
              </h1>
              <p className="text-sm yacht-text-luxury">Professional Brokerage Platform</p>
            </Link>
            
            <div className="text-right">
              <Link 
                href="/dashboard/boats"
                style={{
                  color: '#6B7280',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                ← Back to Boats
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="yacht-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Page Header */}
          <div className="mb-8">
            <h2 style={{ 
              fontSize: '32px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '8px'
            }}>
              Add New Boat
            </h2>
            <p style={{ 
              fontSize: '16px',
              color: '#6B7280'
            }}>
              List a new yacht in your <span className="yacht-text-luxury">premium</span> inventory
            </p>
          </div>

          {error && (
            <div style={{ 
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              color: '#DC2626'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{error}</div>
            </div>
          )}

          {/* Form */}
          <div style={{ 
            background: 'var(--white)', 
            borderRadius: '12px', 
            padding: '32px',
            border: '1px solid var(--gray-200)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                Boat Images
              </label>
              
              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${isDragOver ? 'var(--accent-gold)' : 'var(--gray-300)'}`,
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  background: isDragOver ? 'rgba(212, 165, 116, 0.05)' : 'var(--white)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
                onClick={() => document.getElementById('image-input')?.click()}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.4' }}>📸</div>
                <h4 style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Upload Boat Images
                </h4>
                <p style={{ 
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '16px'
                }}>
                  Drag and drop images here, or click to browse
                </p>
                <p style={{ 
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>
                  Supports: JPG, PNG, WEBP • Max 10MB per image
                </p>
                
                <input
                  id="image-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  style={{ display: 'none' }}
                />
              </div>
              
              {/* Image Previews */}
              {images.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '16px',
                  marginTop: '16px'
                }}>
                  {images.map((image) => (
                    <div key={image.id} style={{ position: 'relative' }}>
                      <div style={{
                        aspectRatio: '16/9',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--gray-200)',
                        position: 'relative'
                      }}>
                        <Image
                          src={image.preview}
                          alt="Preview"
                          layout="fill"
                          objectFit="cover"
                        />
                        
                        {/* Upload Progress */}
                        {uploadProgress[image.id] !== undefined && uploadProgress[image.id] < 100 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            right: '8px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            borderRadius: '4px',
                            padding: '4px'
                          }}>
                            <div style={{
                              width: '100%',
                              height: '2px',
                              background: 'rgba(255, 255, 255, 0.3)',
                              borderRadius: '1px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${uploadProgress[image.id] || 0}%`,
                                height: '100%',
                                background: 'var(--accent-gold)',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        )}
                        
                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'rgba(220, 38, 38, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(220, 38, 38, 1)'
                            e.currentTarget.style.transform = 'scale(1.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'
                            e.currentTarget.style.transform = 'scale(1)'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      
                      <p style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        marginTop: '4px',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {image.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Boat Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g., Ocean Explorer"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="type" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Boat Type *
                </label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: '400',
                    height: '48px'
                  }}>
                    <SelectValue placeholder="Select boat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motor-yacht">Motor Yacht</SelectItem>
                    <SelectItem value="sailing-yacht">Sailing Yacht</SelectItem>
                    <SelectItem value="catamaran">Catamaran</SelectItem>
                    <SelectItem value="sport-boat">Sport Boat</SelectItem>
                    <SelectItem value="superyacht">Superyacht</SelectItem>
                    <SelectItem value="fishing-boat">Fishing Boat</SelectItem>
                    <SelectItem value="speedboat">Speedboat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="year" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Year Built
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.year}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="2023"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="length" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Length (meters)
                </label>
                <input
                  id="length"
                  name="length"
                  type="number"
                  step="0.1"
                  value={formData.length}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="25.5"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="condition" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Condition
                </label>
                <Select value={formData.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                  <SelectTrigger style={{
                    width: '100%',
                    background: 'var(--white)',
                    border: '2px solid var(--gray-200)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: '400',
                    height: '48px'
                  }}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="needs-work">Needs Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="manufacturer" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Manufacturer
                </label>
                <input
                  id="manufacturer"
                  name="manufacturer"
                  type="text"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Azimut, Princess, Sunseeker"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label htmlFor="location" style={{ 
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Current Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="e.g. Monaco, Miami, Split"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            <div>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Price *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Select value={formData.currency} onValueChange={(value) => handleSelectChange('currency', value)}>
                    <SelectTrigger style={{
                      width: '100%',
                      background: 'var(--white)',
                      border: '2px solid var(--gray-200)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      fontSize: '15px',
                      fontWeight: '400',
                      height: '48px'
                    }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR €</SelectItem>
                      <SelectItem value="USD">USD $</SelectItem>
                      <SelectItem value="GBP">GBP £</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="1250000"
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                style={{...inputStyle, resize: 'vertical'}}
                placeholder="Detailed description of the boat..."
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            <div>
              <label htmlFor="features" style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Key Features
              </label>
              <textarea
                id="features"
                name="features"
                rows={3}
                value={formData.features}
                onChange={handleChange}
                style={{...inputStyle, resize: 'vertical'}}
                placeholder="e.g. Air conditioning, GPS, Autopilot, Tender, Water maker..."
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {error && (
              <div style={{ 
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                padding: '12px',
                color: '#DC2626'
              }}>
                <div style={{ fontSize: '14px', fontWeight: '500' }}>{error}</div>
              </div>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                style={{ 
                  width: '100%',
                  background: isLoading ? '#9CA3AF' : 'var(--accent-gold)',
                  color: 'var(--primary-navy)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                    Creating Boat Listing...
                  </div>
                ) : (
                  'Create Boat Listing'
                )}
              </button>
            </div>
          </form>
          </div>
        </div>
      </main>
    </div>
  )
} 