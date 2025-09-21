import { Client } from "@/lib/schemas/client"
import { DataTable, DataTableRow } from "@/components/shared/DataTable"
import { EmptyState } from "@/components/shared/EmptyState"
import { ClientCard } from "./ClientCard"
import { cardStyles } from '@/lib/styles'

interface ClientsListProps {
  clients: Client[]
  filteredClients: Client[]
  isLoading: boolean
  onEditClient: (client: Client) => void
}

export const ClientsList = ({ clients, filteredClients, isLoading, onEditClient }: ClientsListProps) => {
  if (isLoading) {
    return (
      <div style={{ 
        ...cardStyles.container,
        padding: '48px',
        textAlign: 'center'
      }}>
        <div className="text-4xl mb-4" style={{ opacity: '0.3' }}>👥</div>
        <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading clients...</p>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div style={cardStyles.container}>
        <EmptyState
          icon="👥"
          title="No clients yet"
          description="Start building your client portfolio by adding your first client"
          actionButton={{
            href: "/dashboard/clients/new",
            label: "Add Your First Client",
            icon: "👤"
          }}
        />
      </div>
    )
  }

  return (
    <DataTable 
      headers={['Client', 'Contact', 'Company', 'Budget', 'Reminder', 'Actions']}
      headerAlignments={['left', 'left', 'left', 'left', 'left', 'right']}
    >
      {filteredClients.map((client, index) => (
        <DataTableRow key={client.id} isLast={index === filteredClients.length - 1}>
          <ClientCard 
            client={client} 
            index={index} 
            totalCount={filteredClients.length}
            onEditClient={onEditClient}
          />
        </DataTableRow>
      ))}
    </DataTable>
  )
}
