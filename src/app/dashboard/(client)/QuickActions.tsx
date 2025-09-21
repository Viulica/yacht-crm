"use client"

import Link from "next/link"
import { UserPlus, Ship, Users, Anchor } from 'lucide-react'

export const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage your yacht brokerage operations
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <QuickActionCard
            href="/dashboard/clients/new"
            icon={<UserPlus className="w-5 h-5" />}
            title="Add New Client"
            description="Register a new client to your portfolio"
          />
          <QuickActionCard
            href="/dashboard/boats/new"
            icon={<Ship className="w-5 h-5" />}
            title="Add New Boat"
            description="List a new yacht in your inventory"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <SecondaryActionLink
            href="/dashboard/clients"
            label="View All Clients"
            icon={<Users className="w-4 h-4" />}
          />
          <SecondaryActionLink
            href="/dashboard/boats"
            label="View All Boats"
            icon={<Anchor className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

const QuickActionCard = ({ href, icon, title, description }: QuickActionCardProps) => {
  return (
    <Link 
      href={href}
      className="block bg-white border-2 border-gray-200 rounded-lg p-6 text-center transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="text-gray-600 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 shadow-sm mb-4">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h4>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </Link>
  )
}

interface SecondaryActionLinkProps {
  href: string
  label: string
  icon: React.ReactNode
}

const SecondaryActionLink = ({ href, label, icon }: SecondaryActionLinkProps) => {
  return (
    <Link 
      href={href}
      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
    >
      {icon}
      {label}
    </Link>
  )
}
