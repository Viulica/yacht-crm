import { Client, ReminderModal as ReminderModalType, ReminderForm } from "@/lib/schemas/client"
import { modalStyles, formStyles, buttonStyles, inputHandlers } from '@/lib/styles'

interface ReminderModalProps {
  modal: ReminderModalType
  form: ReminderForm
  onClose: () => void
  onSave: () => void
  onFormChange: (field: keyof ReminderForm, value: string) => void
}

export const ReminderModal = ({ modal, form, onClose, onSave, onFormChange }: ReminderModalProps) => {
  if (!modal.isOpen) return null

  return (
    <div style={modalStyles.overlay}>
      <div style={{
        ...modalStyles.container,
        maxWidth: '500px',
        width: '90%',
        maxHeight: 'auto',
        padding: '32px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '8px'
        }}>
          Set Reminder
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginBottom: '24px'
        }}>
          {modal.client?.name || 'Unnamed Client'}
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={formStyles.label}>
            Reminder Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => onFormChange('date', e.target.value)}
            style={formStyles.input}
            onFocus={inputHandlers.onFocus}
            onBlur={inputHandlers.onBlur}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={formStyles.label}>
            Action Note
          </label>
          <textarea
            value={form.note}
            onChange={(e) => onFormChange('note', e.target.value)}
            placeholder="What needs to be done? (e.g., Follow up on yacht preferences, Send proposal, Schedule viewing)"
            rows={3}
            style={formStyles.textarea}
            onFocus={inputHandlers.onFocus}
            onBlur={inputHandlers.onBlur}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              ...buttonStyles.secondary,
              padding: '12px 20px',
              fontSize: '14px',
              border: '2px solid var(--gray-200)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D1D5DB'
              e.currentTarget.style.background = '#F9FAFB'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--gray-200)'
              e.currentTarget.style.background = 'var(--white)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              ...buttonStyles.primary,
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Save Reminder
          </button>
        </div>
      </div>
    </div>
  )
}
