import Image from 'next/image'
import { formStyles, dragDropStyles } from '@/lib/styles'
import { ImageFile } from '@/lib/schemas/boat'

interface ImageUploadProps {
  images: ImageFile[]
  isDragOver: boolean
  uploadProgress: { [key: string]: number }
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (files: FileList) => void
  onRemoveImage: (id: string) => void
}

export function ImageUpload({
  images,
  isDragOver,
  uploadProgress,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onRemoveImage
}: ImageUploadProps) {
  return (
    <div>
      <label style={formStyles.label}>
        Boat Images
      </label>
      
      {/* Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={dragDropStyles.zone(isDragOver)}
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
          onChange={(e) => e.target.files && onFileSelect(e.target.files)}
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
                  onClick={() => onRemoveImage(image.id)}
                  style={dragDropStyles.removeButton}
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
  )
}
