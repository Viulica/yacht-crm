export const formStyles = {
  input: {
    width: '100%',
    background: 'var(--white)',
    border: '2px solid var(--gray-200)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '400',
    transition: 'all 0.3s ease'
  },
  
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  
  select: {
    width: '100%',
    background: 'var(--white)',
    border: '2px solid var(--gray-200)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '400',
    height: '48px'
  },
  
  textarea: {
    width: '100%',
    background: 'var(--white)',
    border: '2px solid var(--gray-200)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '400',
    transition: 'all 0.3s ease',
    resize: 'vertical' as const
  },
  
  button: {
    width: '100%',
    background: 'var(--accent-gold)',
    color: 'var(--primary-navy)',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  
  buttonDisabled: {
    width: '100%',
    background: '#9CA3AF',
    color: 'var(--primary-navy)',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'not-allowed',
    transition: 'all 0.2s ease'
  },
  
  errorAlert: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    color: '#DC2626'
  },
  
  formContainer: {
    background: 'var(--white)', 
    borderRadius: '12px', 
    padding: '32px',
    border: '1px solid var(--gray-200)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
  }
}

export const dragDropStyles = {
  zone: (isDragOver: boolean) => ({
    border: `2px dashed ${isDragOver ? 'var(--accent-gold)' : 'var(--gray-300)'}`,
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center' as const,
    background: isDragOver ? 'rgba(212, 165, 116, 0.05)' : 'var(--white)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    marginBottom: '16px'
  }),
  
  removeButton: {
    position: 'absolute' as const,
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
  }
}

export const inputHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--accent-gold)'
    e.target.style.boxShadow = '0 0 0 3px rgba(212, 165, 116, 0.1)'
  },
  
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--gray-200)'
    e.target.style.boxShadow = 'none'
  }
}

// Modal Styles
export const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  },
  
  container: {
    width: '100%',
    maxWidth: '4xl',
    maxHeight: '90vh',
    backgroundColor: 'var(--white)',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid var(--gray-200)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const
  },
  
  header: {
    background: 'var(--white)',
    borderBottom: '1px solid var(--gray-200)',
    padding: '24px 32px',
    flexShrink: 0
  },
  
  content: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto' as const
  },
  
  footer: {
    background: 'var(--white)',
    padding: '24px 32px',
    borderTop: '1px solid var(--gray-200)',
    flexShrink: 0
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  }
}

// Button Styles
export const buttonStyles = {
  primary: {
    background: 'var(--accent-gold)',
    color: 'var(--primary-navy)',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  },
  
  secondary: {
    background: 'var(--white)',
    color: '#6B7280',
    border: '1px solid var(--gray-300)',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  
  danger: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  }
}

// Card Styles
export const cardStyles = {
  container: {
    background: 'var(--white)',
    borderRadius: '12px',
    border: '1px solid var(--gray-200)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
  },
  
  header: {
    borderBottom: '1px solid var(--gray-200)',
    padding: '20px 24px',
    background: '#F9FAFB',
    borderRadius: '12px 12px 0 0'
  },
  
  content: {
    padding: '24px'
  }
}

// Badge Styles
export const badgeStyles = {
  primary: {
    background: 'var(--accent-gold)',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  
  secondary: {
    background: '#F3F4F6',
    color: '#6B7280',
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 8px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    marginLeft: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

// Typography Styles
export const typographyStyles = {
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1F2937',
    margin: 0
  },
  
  subheading: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: 0
  },
  
  body: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  
  caption: {
    fontSize: '12px',
    color: '#9CA3AF',
    margin: 0
  }
}
