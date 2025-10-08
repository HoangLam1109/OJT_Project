import { useState } from 'react'

export const Admin = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Bảng điều khiển', 
      icon: '📊',
      isActive: true 
    },
    //aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    { 
      id: 'patients', 
      label: 'Quản lý bệnh nhân', 
      icon: '👥' 
    },
    { 
      id: 'tests', 
      label: 'Quản lý xét nghiệm', 
      icon: '🧪' 
    },
    { 
      id: 'instruments', 
      label: 'Quản lý thiết bị', 
      icon: '⚙️' 
    },
    { 
      id: 'reagents', 
      label: 'Quản lý hóa chất', 
      icon: '🧬' 
    },
    { 
      id: 'monitoring', 
      label: 'Giám sát', 
      icon: '📈' 
    },
    { 
      id: 'users', 
      label: 'Quản lý người dùng', 
      icon: '👤' 
    },
    { 
      id: 'configurations', 
      label: 'Cấu hình', 
      icon: '⚙️' 
    },
    { 
      id: 'reports', 
      label: 'Báo cáo & Phân tích', 
      icon: '📋' 
    },
    { 
      id: 'roles', 
      label: 'Quản lý vai trò', 
      icon: '🔐' 
    },
    { 
      id: 'eventlogs', 
      label: 'Event Logs', 
      icon: '📝' 
    },
    { 
      id: 'profile', 
      label: 'Hồ sơ cá nhân', 
      icon: '👨‍💼' 
    }
  ]

  const handleLogout = () => {
    window.location.hash = ''
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: isSidebarCollapsed ? '80px' : '280px',
        backgroundColor: '#2d3748',
        color: 'white',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        {/* Logo/Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #4a5568',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#4299e1',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            🧪
          </div>
          {!isSidebarCollapsed && (
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>LIMS Quản trị</div>
              <div style={{ fontSize: '12px', color: '#a0aec0' }}>
                Chào mừng, TS. Sarah - Quản trị viên
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                padding: isSidebarCollapsed ? '12px 20px' : '12px 20px',
                margin: '4px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeMenu === item.id ? '#4299e1' : 'transparent',
                color: activeMenu === item.id ? 'white' : '#e2e8f0',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px'
              }}
              onMouseOver={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.backgroundColor = '#4a5568'
                }
              }}
              onMouseOut={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '20px', borderTop: '1px solid #4a5568' }}>
          <div
            onClick={handleLogout}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#e53e3e',
              color: 'white',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              textAlign: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#c53030'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#e53e3e'
            }}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            {!isSidebarCollapsed && <span>Đăng xuất</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: isSidebarCollapsed ? '80px' : '280px',
        flex: 1,
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: '#f7fafc',
                color: '#4a5568'
              }}
            >
              ☰
            </button>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#2d3748',
              margin: 0
            }}>
              Hệ Thống Quản Lý Thông Tin Phòng Thí Nghiệm
            </h1>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            fontSize: '14px',
            color: '#718096'
          }}>
            <span>Quản trị viên</span>
            <span>Thứ 7, 8 tháng 10, 2025</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: '24px' }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#e6f7ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  👥
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>1,247</div>
                  <div style={{ fontSize: '14px', color: '#718096' }}>Tổng số bệnh nhân</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#38a169' }}>↗ +12 từ tuần trước</div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#fff3e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🧪
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>23</div>
                  <div style={{ fontSize: '14px', color: '#718096' }}>Xét nghiệm hôm nay</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#f6ad55' }}>⚠ 8 chờ xử lý</div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f0fff4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  💰
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748' }}>45,680 VND</div>
                  <div style={{ fontSize: '14px', color: '#718096' }}>Doanh thu tháng</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#38a169' }}>↗ +8.2% từ tháng trước</div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px'
          }}>
            {/* System Alerts */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '20px' 
              }}>
                <span style={{ fontSize: '24px' }}>🚨</span>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#2d3748',
                  margin: 0 
                }}>
                  Cảnh báo hệ thống
                </h3>
              </div>
              <div style={{ color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
                Thông báo và cảnh báo gần đây
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#fef5e7',
                  borderRadius: '8px',
                  borderLeft: '4px solid #f6ad55',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    Hóa chất Sinh hóa máu dưới mức tồn kho tối thiểu
                  </span>
                  <span style={{ fontSize: '12px', color: '#a0aec0' }}>10 phút trước</span>
                </div>
                
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f0fff4',
                  borderRadius: '8px',
                  borderLeft: '4px solid #38a169',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    5 kết quả xét nghiệm đang chờ xác nhận
                  </span>
                  <span style={{ fontSize: '12px', color: '#a0aec0' }}>30 phút trước</span>
                </div>
                
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#e6f7ff',
                  borderRadius: '8px',
                  borderLeft: '4px solid #4299e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', color: '#2d3748' }}>
                    Báo cáo tài chính hàng ngày sẵn sàng để xem xét
                  </span>
                  <span style={{ fontSize: '12px', color: '#a0aec0' }}>1 giờ trước</span>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '20px' 
              }}>
                <span style={{ fontSize: '24px' }}>📅</span>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: '#2d3748',
                  margin: 0 
                }}>
                  Lịch trình hôm nay
                </h3>
              </div>
              <div style={{ color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
                Sự kiện và deadline quan trọng
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#2d3748',
                    fontWeight: 'bold',
                    minWidth: '40px'
                  }}>
                    09:00
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
                      Họp nhân viên
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'white',
                      backgroundColor: '#4299e1',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      meeting
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#2d3748',
                    fontWeight: 'bold',
                    minWidth: '40px'
                  }}>
                    11:00
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
                      Bảo trì thiết bị
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'white',
                      backgroundColor: '#f6ad55',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      maintenance
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#2d3748',
                    fontWeight: 'bold',
                    minWidth: '40px'
                  }}>
                    14:00
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
                      Kiểm tra chất lượng
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'white',
                      backgroundColor: '#38a169',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      qc
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#2d3748',
                    fontWeight: 'bold',
                    minWidth: '40px'
                  }}>
                    15:00
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: '#2d3748', fontWeight: '500' }}>
                      Xem xét báo cáo tài chính
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: 'white',
                      backgroundColor: '#9f7aea',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      report
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
