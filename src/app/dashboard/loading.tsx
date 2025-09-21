export default function DashboardLoading() {
  return (
    <div className="min-h-screen yacht-flex-center" style={{ background: 'linear-gradient(135deg, #FEFEFE 0%, #F4F6F8 100%)' }}>
      <div className="text-center">
        <p style={{ 
          fontFamily: 'var(--font-heading)',
          fontSize: '24px',
          fontWeight: '300',
          color: '#374151',
          letterSpacing: '0.5px',
          marginBottom: '16px'
        }}>
          Loading your exclusive dashboard...
        </p>
        <div className="yacht-shimmer w-32 h-2 rounded-full mx-auto"></div>
      </div>
    </div>
  )
}
