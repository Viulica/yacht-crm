import { getDashboardData } from "@/lib/server-data"
import { RemindersSection } from "@/app/dashboard/(client)/RemindersSection"
import { StatsOverview } from "@/app/dashboard/(client)/StatsOverview"
import { QuickActions } from "@/app/dashboard/(client)/QuickActions"
import { DashboardHeaderClient } from "@/app/dashboard/(client)/DashboardHeaderClient"

export default async function Dashboard() {
  const { user, stats } = await getDashboardData()

  // Stats are passed as-is, reminder count is calculated dynamically in StatsOverview

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
      <DashboardHeaderClient
        userName={user.user_metadata?.name || ''}
        userEmail={user.email || ''}
      />

      <main className="yacht-container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <RemindersSection />
        
        <StatsOverview
          stats={stats}
          isLoading={false}
        />

        <QuickActions />
      </main>

    </div>
  )
} 