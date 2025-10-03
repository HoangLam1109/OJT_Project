import { LogoutButton } from '../../components/common'

export const LabManagement = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      <LogoutButton userRole="Trưởng phòng Lab" userName="Lab Manager" />
      
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
            Bảng Điều Khiển Trưởng Phòng Lab
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Quản lý hoạt động và nhân sự phòng thí nghiệm
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
                Quản lý nhân viên Lab
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Phân công và quản lý nhân viên phòng lab
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Quản lý thiết bị
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Theo dõi và bảo trì thiết bị phòng lab
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Báo cáo hoạt động
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Tổng hợp báo cáo hoạt động lab
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
