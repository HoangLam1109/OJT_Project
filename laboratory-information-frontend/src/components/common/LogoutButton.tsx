interface LogoutButtonProps {
  userRole?: string
  userName?: string
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ userRole, userName }) => {
  const handleLogout = () => {
    // Clear any stored authentication data if needed
    // localStorage.removeItem('authToken')
    // sessionStorage.clear()
    
    // Navigate back to login page
    window.location.hash = ''
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '8px 16px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: '1px solid rgba(229, 231, 235, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      fontSize: '14px',
      maxWidth: 'calc(100vw - 40px)'
    }}>
      {userRole && (
        <div style={{ 
          color: '#6b7280',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          minWidth: 0 // Allow flex shrinking
        }}>
          {userName && (
            <span style={{ 
              fontWeight: '600', 
              color: '#374151',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px'
            }}>
              {userName}
            </span>
          )}
          <span style={{ 
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '150px'
          }}>
            {userRole}
          </span>
        </div>
      )}
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 14px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          minWidth: 'fit-content'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#b91c1c'
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626'
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
        }}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
          Đăng xuất
        </span>
      </button>
    </div>
  )
}