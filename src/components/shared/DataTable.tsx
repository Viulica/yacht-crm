import { ReactNode } from 'react'

interface DataTableProps {
  headers: string[]
  children: ReactNode
  headerAlignments?: ('left' | 'right')[]
}

export const DataTable = ({ headers, children, headerAlignments = [] }: DataTableProps) => {
  return (
    <div style={{ 
      background: 'var(--white)', 
      borderRadius: '12px', 
      border: '1px solid var(--gray-200)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Table Header */}
      <div style={{
        borderBottom: '1px solid var(--gray-200)',
        padding: '20px 24px',
        background: '#F9FAFB',
        borderRadius: '12px 12px 0 0'
      }}>
        <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
          {headers.map((header, index) => (
            <div 
              key={index} 
              style={{ 
                fontWeight: '600', 
                fontSize: '14px', 
                color: '#374151',
                textAlign: headerAlignments[index] || 'left'
              }}
            >
              {header}
            </div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div>
        {children}
      </div>
    </div>
  )
}

interface DataTableRowProps {
  children: ReactNode
  isLast?: boolean
}

export const DataTableRow = ({ children, isLast = false }: DataTableRowProps) => {
  return (
    <div 
      style={{
        borderBottom: isLast ? 'none' : '1px solid var(--gray-200)',
        padding: '0 24px',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F9FAFB'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      {children}
    </div>
  )
}
