import { Boat } from "@/lib/schemas/boat"
import { DataTable, DataTableRow } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { BoatCard } from "./BoatCard"

interface BoatsListProps {
  boats: Boat[]
  filteredBoats: Boat[]
  isLoading: boolean
  onEditBoat: (boat: Boat) => void
}

export const BoatsList = ({ boats, filteredBoats, isLoading, onEditBoat }: BoatsListProps) => {
  if (isLoading) {
    return (
      <div style={{ 
        background: 'var(--white)', 
        borderRadius: '12px', 
        border: '1px solid var(--gray-200)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        padding: '48px',
        textAlign: 'center'
      }}>
        <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>🛥️</div>
        <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading boats...</p>
      </div>
    )
  }

  if (boats.length === 0) {
    return (
      <div style={{ 
        background: 'var(--white)', 
        borderRadius: '12px', 
        border: '1px solid var(--gray-200)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <EmptyState
          icon="🛥️"
          title="No boats yet"
          description="Start building your fleet inventory by adding your first boat"
          actionButton={{
            href: "/dashboard/boats/new",
            label: "Add Your First Boat",
            icon: "🛥️"
          }}
        />
      </div>
    )
  }

  return (
    <DataTable 
      headers={['Image', 'Boat', 'Details', 'Location', 'Price', 'Added', 'Actions']}
      headerAlignments={['left', 'left', 'left', 'left', 'left', 'left', 'right']}
    >
      {filteredBoats.map((boat, index) => (
        <DataTableRow key={boat.id} isLast={index === filteredBoats.length - 1}>
          <BoatCard 
            boat={boat} 
            index={index} 
            totalCount={filteredBoats.length}
            onEditBoat={onEditBoat}
          />
        </DataTableRow>
      ))}
    </DataTable>
  )
}
