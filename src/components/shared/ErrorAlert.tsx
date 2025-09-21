interface ErrorAlertProps {
  message: string
}

export const ErrorAlert = ({ message }: ErrorAlertProps) => {
  return (
    <div style={{ 
      background: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      color: '#DC2626'
    }}>
      <div style={{ fontSize: '14px', fontWeight: '500' }}>{message}</div>
    </div>
  )
}
