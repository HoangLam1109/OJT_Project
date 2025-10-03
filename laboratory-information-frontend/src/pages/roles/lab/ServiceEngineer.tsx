import { LogoutButton } from '../../../components/common'

export const ServiceEngineer = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      <LogoutButton userRole="Kỹ thuật viên Bảo trì" userName="Service Engineer" />
      
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
            Bảng Điều Khiển Kỹ Thuật Viên Bảo Trì
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Chuyên trách bảo trì và sửa chữa thiết bị phòng thí nghiệm
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
                Sửa chữa thiết bị
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Khắc phục sự cố và sửa chữa thiết bị
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Kiểm tra định kỳ
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Thực hiện kiểm tra và hiệu chuẩn
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Lịch bảo trì
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Lập kế hoạch bảo trì thiết bị
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


