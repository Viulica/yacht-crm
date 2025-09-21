import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cardStyles, formStyles, buttonStyles, typographyStyles, badgeStyles } from '@/lib/styles'

interface ClientFiltersProps {
  onFiltersChange: (filters: {
    modelInterest: string
    budget: string
  }) => void
}

export const ClientFilters = ({ onFiltersChange }: ClientFiltersProps) => {
  const [filters, setFilters] = useState({
    modelInterest: 'all',
    budget: 'all'
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
    const clearedFilters = { modelInterest: 'all', budget: 'all' }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = filters.modelInterest !== 'all' || filters.budget !== 'all'

  return (
    <div style={{
      ...cardStyles.container,
      padding: '20px 24px',
      marginBottom: '24px'
    }}>
      <div className="flex items-center justify-between mb-4">
        <h3 style={typographyStyles.subheading}>
          Filter Clients
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            style={{
              ...buttonStyles.secondary,
              background: 'none',
              border: 'none',
              fontSize: '14px',
              padding: '4px 8px',
              borderRadius: '4px'
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model Interest Filter */}
        <div>
          <label style={formStyles.label}>
            Interested In
          </label>
          <Select 
            value={filters.modelInterest} 
            onValueChange={(value) => handleFilterChange('modelInterest', value)}
          >
            <SelectTrigger 
              className="w-full"
              style={formStyles.select}
            >
              <SelectValue placeholder="All boat types" />
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
              <SelectItem value="all">All boat types</SelectItem>
              <SelectItem value="Motor Yacht">Motor Yacht</SelectItem>
              <SelectItem value="Sailing Yacht">Sailing Yacht</SelectItem>
              <SelectItem value="Catamaran">Catamaran</SelectItem>
              <SelectItem value="Sport Boat">Sport Boat</SelectItem>
              <SelectItem value="Superyacht">Superyacht</SelectItem>
              <SelectItem value="Trawler">Trawler</SelectItem>
              <SelectItem value="Fishing Boat">Fishing Boat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Filter */}
        <div>
          <label style={formStyles.label}>
            Budget Range
          </label>
          <Select 
            value={filters.budget} 
            onValueChange={(value) => handleFilterChange('budget', value)}
          >
            <SelectTrigger 
              className="w-full"
              style={formStyles.select}
            >
              <SelectValue placeholder="All budgets" />
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
              <SelectItem value="all">All budgets</SelectItem>
              <SelectItem value="under-500k">Under €500K</SelectItem>
              <SelectItem value="500k-1m">€500K - €1M</SelectItem>
              <SelectItem value="1m-5m">€1M - €5M</SelectItem>
              <SelectItem value="5m-10m">€5M - €10M</SelectItem>
              <SelectItem value="10m-plus">€10M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.modelInterest !== 'all' && (
              <span style={badgeStyles.primary}>
                Interested in: {filters.modelInterest}
                <button
                  onClick={() => handleFilterChange('modelInterest', 'all')}
                  style={badgeStyles.closeButton}
                >
                  ×
                </button>
              </span>
            )}
            {filters.budget !== 'all' && (
              <span style={badgeStyles.primary}>
                Budget: {filters.budget === 'under-500k' ? 'Under €500K' :
                        filters.budget === '500k-1m' ? '€500K - €1M' :
                        filters.budget === '1m-5m' ? '€1M - €5M' :
                        filters.budget === '5m-10m' ? '€5M - €10M' :
                        filters.budget === '10m-plus' ? '€10M+' : filters.budget}
                <button
                  onClick={() => handleFilterChange('budget', 'all')}
                  style={badgeStyles.closeButton}
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
