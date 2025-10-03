import { LogoutButton } from '../../../components/common'

export const LabUser = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', position: 'relative' }}>
      <LogoutButton userRole="Nhân viên Lab" userName="Lab User" />
      
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
            Bảng Điều Khiển Nhân Viên Lab
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            marginBottom: '32px'
          }}>
            Thực hiện các công việc hàng ngày trong phòng thí nghiệm
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
                Xử lý mẫu thử
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Tiếp nhận và xử lý các mẫu thử nghiệm
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Thực hiện thí nghiệm
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Chạy các thí nghiệm theo quy trình
              </p>
            </div>
            
            <div style={{
              padding: '24px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Ghi nhận kết quả
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                Nhập và xác nhận kết quả thí nghiệm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


