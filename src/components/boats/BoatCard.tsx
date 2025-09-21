import Image from "next/image"
import { Boat } from "@/lib/schemas/boat"
import { formatCurrency } from '@/lib/dashboard-utils'

interface BoatCardProps {
  boat: Boat
  index: number
  totalCount: number
  onEditBoat: (boat: Boat) => void
}

export const BoatCard = ({ boat, index, totalCount, onEditBoat }: BoatCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: string | null) => {
    if (!price) return 'Price on request'
    return formatCurrency(price)
  }

  return (
    <div className="grid grid-cols-7 gap-4 items-center py-4 hover:bg-gray-50 transition-all duration-200">
      {/* Boat Image Thumbnail */}
      <div>
        {boat.images && boat.images.length > 0 ? (
          <div style={{
            width: '60px',
            height: '40px',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid var(--gray-200)',
            position: 'relative'
          }}>
            <Image
              src={boat.images[0].url}
              alt={boat.images[0].alt || 'Boat image'}
              layout="fill"
              objectFit="cover"
            />
            {boat.images.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                fontSize: '10px',
                padding: '1px 4px',
                borderRadius: '2px'
              }}>
                +{boat.images.length - 1}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            width: '60px',
            height: '40px',
            borderRadius: '6px',
            border: '1px solid var(--gray-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F9FAFB',
            fontSize: '16px',
            opacity: '0.4'
          }}>
            🛥️
          </div>
        )}
      </div>

      {/* Boat Name */}
      <div>
        <div style={{ fontWeight: '600', fontSize: '15px', color: '#1F2937', marginBottom: '4px' }}>
          {boat.model || 'Unnamed Boat'}
        </div>
        {boat.brand && (
          <div style={{ fontSize: '13px', color: '#6B7280' }}>
            {boat.brand}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        {boat.year && (
          <div style={{ fontSize: '14px', color: '#1F2937', marginBottom: '2px' }}>
            {boat.year}
          </div>
        )}
        {boat.size && (
          <div style={{ fontSize: '13px', color: '#6B7280' }}>
            {boat.size}m
          </div>
        )}
      </div>

      {/* Location */}
      <div style={{ fontSize: '14px', color: '#1F2937' }}>
        {boat.location || '-'}
      </div>

      {/* Price */}
      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--accent-gold)' }}>
        {formatPrice(boat.price)}
      </div>

      {/* Date Added */}
      <div style={{ fontSize: '13px', color: '#6B7280' }}>
        {formatDate(boat.createdAt.toString())}
      </div>

      {/* Actions Column - Far Right */}
      <div className="min-w-0 flex flex-col items-end space-y-2">
        <button
          onClick={() => onEditBoat(boat)}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-gold)'
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--gray-200)'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.04)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
    </div>
  )
}
