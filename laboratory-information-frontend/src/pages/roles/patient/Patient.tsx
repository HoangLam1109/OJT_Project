import { LogoutButton } from '../../../components/common'

export const Patient = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      <LogoutButton userRole="Bệnh nhân" userName="Patient" />
      
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
            Cổng Thông Tin Bệnh Nhân
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Truy cập kết quả xét nghiệm và thông tin cá nhân
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
                Kết quả xét nghiệm
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Xem kết quả các xét nghiệm đã thực hiện
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Lịch hẹn
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Đặt lịch và xem lịch hẹn xét nghiệm
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Thông tin cá nhân
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Cập nhật thông tin và địa chỉ liên hệ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


