import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BoatFiltersProps {
  onFiltersChange: (filters: {
    location: string
    size: string
    price: string
    brand: string
  }) => void
}

export const BoatFilters = ({ onFiltersChange }: BoatFiltersProps) => {
  const [filters, setFilters] = useState({
    location: 'all',
    size: 'all',
    price: 'all',
    brand: 'all'
  })

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = {
      ...filters,
      [field]: value
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = { location: 'all', size: 'all', price: 'all', brand: 'all' }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.location !== 'all' || filters.size !== 'all' || filters.price !== 'all' || filters.brand !== 'all'

  return (
    <div style={{
      background: 'var(--white)',
      borderRadius: '12px',
      border: '1px solid var(--gray-200)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      padding: '20px 24px',
      marginBottom: '24px'
    }}>
      <div className="flex items-center justify-between mb-4">
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
          margin: 0
        }}>
          Filter Boats
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#6B7280',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6'
              e.currentTarget.style.color = '#374151'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6B7280'
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Location
          </label>
          <Select 
            value={filters.location} 
            onValueChange={(value) => handleFilterChange('location', value)}
          >
            <SelectTrigger 
              className="w-full"
              style={{
                width: '100%',
                background: 'var(--white)',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent 
              className="z-[9999]"
              style={{
                zIndex: 9999,
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '200px'
              }}
            >
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="Monaco">Monaco</SelectItem>
              <SelectItem value="Cannes">Cannes</SelectItem>
              <SelectItem value="Nice">Nice</SelectItem>
              <SelectItem value="Antibes">Antibes</SelectItem>
              <SelectItem value="Split">Split</SelectItem>
              <SelectItem value="Dubrovnik">Dubrovnik</SelectItem>
              <SelectItem value="Barcelona">Barcelona</SelectItem>
              <SelectItem value="Palma">Palma</SelectItem>
              <SelectItem value="Ibiza">Ibiza</SelectItem>
              <SelectItem value="Portofino">Portofino</SelectItem>
              <SelectItem value="Capri">Capri</SelectItem>
              <SelectItem value="Mykonos">Mykonos</SelectItem>
              <SelectItem value="Santorini">Santorini</SelectItem>
              <SelectItem value="Miami">Miami</SelectItem>
              <SelectItem value="Fort Lauderdale">Fort Lauderdale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Size (meters)
          </label>
          <Select 
            value={filters.size} 
            onValueChange={(value) => handleFilterChange('size', value)}
          >
            <SelectTrigger 
              className="w-full"
              style={{
                width: '100%',
                background: 'var(--white)',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <SelectValue placeholder="All sizes" />
            </SelectTrigger>
            <SelectContent 
              className="z-[9999]"
              style={{
                zIndex: 9999,
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '200px'
              }}
            >
              <SelectItem value="all">All sizes</SelectItem>
              <SelectItem value="under-10">Under 10m</SelectItem>
              <SelectItem value="10-15">10m - 15m</SelectItem>
              <SelectItem value="15-20">15m - 20m</SelectItem>
              <SelectItem value="20-30">20m - 30m</SelectItem>
              <SelectItem value="30-40">30m - 40m</SelectItem>
              <SelectItem value="40-50">40m - 50m</SelectItem>
              <SelectItem value="50-plus">50m+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Price Range
          </label>
          <Select 
            value={filters.price} 
            onValueChange={(value) => handleFilterChange('price', value)}
          >
            <SelectTrigger 
              className="w-full"
              style={{
                width: '100%',
                background: 'var(--white)',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <SelectValue placeholder="All prices" />
            </SelectTrigger>
            <SelectContent 
              className="z-[9999]"
              style={{
                zIndex: 9999,
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '200px'
              }}
            >
              <SelectItem value="all">All prices</SelectItem>
              <SelectItem value="under-100k">Under €100K</SelectItem>
              <SelectItem value="100k-500k">€100K - €500K</SelectItem>
              <SelectItem value="500k-1m">€500K - €1M</SelectItem>
              <SelectItem value="1m-5m">€1M - €5M</SelectItem>
              <SelectItem value="5m-10m">€5M - €10M</SelectItem>
              <SelectItem value="10m-20m">€10M - €20M</SelectItem>
              <SelectItem value="20m-plus">€20M+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '8px'
          }}>
            Brand
          </label>
          <Select 
            value={filters.brand} 
            onValueChange={(value) => handleFilterChange('brand', value)}
          >
            <SelectTrigger 
              className="w-full"
              style={{
                width: '100%',
                background: 'var(--white)',
                border: '2px solid var(--gray-200)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent 
              className="z-[9999]"
              style={{
                zIndex: 9999,
                backgroundColor: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                minWidth: '200px'
              }}
            >
              <SelectItem value="all">All brands</SelectItem>
              <SelectItem value="Azimut">Azimut</SelectItem>
              <SelectItem value="Princess">Princess</SelectItem>
              <SelectItem value="Sunseeker">Sunseeker</SelectItem>
              <SelectItem value="Ferretti">Ferretti</SelectItem>
              <SelectItem value="Pershing">Pershing</SelectItem>
              <SelectItem value="Benetti">Benetti</SelectItem>
              <SelectItem value="Lürssen">Lürssen</SelectItem>
              <SelectItem value="Feadship">Feadship</SelectItem>
              <SelectItem value="Oceanco">Oceanco</SelectItem>
              <SelectItem value="Heesen">Heesen</SelectItem>
              <SelectItem value="Amels">Amels</SelectItem>
              <SelectItem value="Lurssen">Lurssen</SelectItem>
              <SelectItem value="CRN">CRN</SelectItem>
              <SelectItem value="Sanlorenzo">Sanlorenzo</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.location !== 'all' && (
              <span style={{
                background: 'var(--accent-gold)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Location: {filters.location}
                <button
                  onClick={() => handleFilterChange('location', 'all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    marginLeft: '4px'
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {filters.size !== 'all' && (
              <span style={{
                background: 'var(--accent-gold)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Size: {filters.size === 'under-10' ? 'Under 10m' :
                      filters.size === '10-15' ? '10m - 15m' :
                      filters.size === '15-20' ? '15m - 20m' :
                      filters.size === '20-30' ? '20m - 30m' :
                      filters.size === '30-40' ? '30m - 40m' :
                      filters.size === '40-50' ? '40m - 50m' :
                      filters.size === '50-plus' ? '50m+' : filters.size}
                <button
                  onClick={() => handleFilterChange('size', 'all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    marginLeft: '4px'
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {filters.price !== 'all' && (
              <span style={{
                background: 'var(--accent-gold)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Price: {filters.price === 'under-100k' ? 'Under €100K' :
                       filters.price === '100k-500k' ? '€100K - €500K' :
                       filters.price === '500k-1m' ? '€500K - €1M' :
                       filters.price === '1m-5m' ? '€1M - €5M' :
                       filters.price === '5m-10m' ? '€5M - €10M' :
                       filters.price === '10m-20m' ? '€10M - €20M' :
                       filters.price === '20m-plus' ? '€20M+' : filters.price}
                <button
                  onClick={() => handleFilterChange('price', 'all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    marginLeft: '4px'
                  }}
                >
                  ×
                </button>
              </span>
            )}
            {filters.brand !== 'all' && (
              <span style={{
                background: 'var(--accent-gold)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Brand: {filters.brand}
                <button
                  onClick={() => handleFilterChange('brand', 'all')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '0',
                    marginLeft: '4px'
                  }}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
