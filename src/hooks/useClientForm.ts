import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateClientInput } from '@/lib/schemas/client'

export function useClientForm() {
  const [formData, setFormData] = useState<CreateClientInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: undefined,
    boatType: '',
    notes: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create client')
        setIsLoading(false)
        return
      }

      router.push('/dashboard/clients')
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return {
    formData,
    isLoading,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit
  }
}
