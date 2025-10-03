import { LogoutButton } from '../../components/common'

export const Admin = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      <LogoutButton userRole="Quản trị viên" userName="Admin User" />
      
      <div style={{ padding: '80px 40px 40px' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            Bảng Điều Khiển Quản Trị Viên
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Chào mừng đến với hệ thống quản lý thông tin phòng thí nghiệm
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginTop: '32px'
          }}>
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Quản lý người dùng
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Thêm, sửa, xóa tài khoản người dùng
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Cấu hình hệ thống
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Thiết lập và cấu hình hệ thống
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Báo cáo tổng hợp
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Xem báo cáo và thống kê tổng quan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
