"use client"

import { useBoatForm } from '@/hooks/useBoatForm'
import { 
  ImageUpload, 
  FormField, 
  SelectField, 
  PriceField, 
  NewBoatHeader 
} from '@/components/boats'
import { formStyles } from '@/lib/styles'

const BRAND_OPTIONS = [
  { value: 'azimut', label: 'Azimut' },
  { value: 'princess', label: 'Princess' },
  { value: 'sunseeker', label: 'Sunseeker' },
  { value: 'ferretti', label: 'Ferretti' },
  { value: 'pershing', label: 'Pershing' },
  { value: 'benetti', label: 'Benetti' },
  { value: 'lurssen', label: 'Lürssen' },
  { value: 'feadship', label: 'Feadship' },
  { value: 'other', label: 'Other' }
]

export default function NewBoat() {
  const {
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
  } = useBoatForm()

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
      <NewBoatHeader />

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
            <div style={formStyles.errorAlert}>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>{error}</div>
            </div>
          )}

          {/* Form */}
          <div style={formStyles.formContainer}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <ImageUpload
                images={images}
                isDragOver={isDragOver}
                uploadProgress={uploadProgress}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onFileSelect={handleFileSelect}
                onRemoveImage={removeImage}
              />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="model"
                  name="model"
                  label="Boat Model"
                  required
                  placeholder="e.g., Ocean Explorer"
                  value={formData.model}
                  onChange={handleChange}
                />

                <SelectField
                  label="Brand"
                  value={formData.brand}
                  onValueChange={(value) => handleSelectChange('brand', value)}
                  placeholder="Select brand"
                  options={BRAND_OPTIONS}
                />
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  id="year"
                  name="year"
                  label="Year Built"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2023"
                  value={formData.year}
                  onChange={handleChange}
                />

                <FormField
                  id="size"
                  name="size"
                  label="Size (meters)"
                  type="number"
                  step="0.1"
                  placeholder="25.5"
                  value={formData.size}
                  onChange={handleChange}
                />

                <FormField
                  id="engineHours"
                  name="engineHours"
                  label="Engine Hours"
                  type="number"
                  min="0"
                  placeholder="500"
                  value={formData.engineHours}
                  onChange={handleChange}
                />
              </div>

              {/* Owner and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="owner"
                  name="owner"
                  label="Owner"
                  placeholder="e.g. John Smith"
                  value={formData.owner}
                  onChange={handleChange}
                />

                <FormField
                  id="location"
                  name="location"
                  label="Current Location"
                  placeholder="e.g. Monaco, Miami, Split"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Engine */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  id="engine"
                  name="engine"
                  label="Engine"
                  placeholder="e.g. Twin MAN V12 1400hp"
                  value={formData.engine}
                  onChange={handleChange}
                />
              </div>

              {/* Price */}
              <PriceField
                currency={formData.currency}
                price={formData.price}
                onCurrencyChange={(value) => handleSelectChange('currency', value)}
                onPriceChange={handleChange}
              />

              {/* Description */}
              <FormField
                id="description"
                name="description"
                label="Description"
                type="textarea"
                rows={4}
                placeholder="Detailed description of the boat..."
                value={formData.description}
                onChange={handleChange}
              />

              {/* Equipment */}
              <FormField
                id="equipment"
                name="equipment"
                label="Equipment"
                type="textarea"
                rows={3}
                placeholder="e.g. Air conditioning, GPS, Autopilot, Tender, Water maker..."
                value={formData.equipment}
                onChange={handleChange}
              />

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={isLoading ? formStyles.buttonDisabled : formStyles.button}
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