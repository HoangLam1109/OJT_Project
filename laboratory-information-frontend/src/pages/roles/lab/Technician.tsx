import { LogoutButton } from '../../../components/common'

export const Technician = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      <LogoutButton userRole="Kỹ thuật viên" userName="Technician" />
      
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
            Bảng Điều Khiển Kỹ Thuật Viên
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Vận hành và bảo trì thiết bị phòng thí nghiệm
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
                Vận hành thiết bị
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Điều khiển và vận hành các thiết bị lab
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Bảo trì định kỳ
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Thực hiện bảo trì thiết bị theo lịch
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Báo cáo sự cố
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Ghi nhận và báo cáo sự cố thiết bị
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


