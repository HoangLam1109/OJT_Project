import { useEffect } from 'react'
import './styles.css'
import viteLogo from '/vite.svg'

function DesktopLogin() {
  return (
    <div className="login-root desktop">
      <div className="login-card appear">
        <div className="login-logo">
          <div className="shield">
            <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
              <path fill="currentColor" d="M12 2l7 3v6c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3zM7 7v4c0 3.6 2.4 7.4 5 8.9 2.6-1.5 5-5.3 5-8.9V7l-5-2-5 2z" />
            </svg>
            <span className="status-dot" />
          </div>
        </div>

        <h1 className="login-title">Hệ Thống Quản Lý Thông Tin</h1>
        <div className="login-subtitle">
          <span>Phòng Thí Nghiệm</span>
        </div>
        <p className="login-desc">
          Đăng nhập để truy cập bảng điều khiển và quản lý hoạt động phòng thí nghiệm
        </p>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span className="field-label">Địa chỉ Email</span>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 8.2l8 6 8-6V18H4V8.2z"/>
                </svg>
              </span>
              <input type="email" placeholder="Nhập địa chỉ email của bạn..." required />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Mật khẩu</span>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="currentColor" d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V6zm7 12H7v-8h10v8z"/>
                </svg>
              </span>
              <input type="password" placeholder="Nhập mật khẩu của bạn..." required />
            </div>
          </label>

          <button className="login-button" type="submit" onClick={() => {
            // Simple demo routing based on email for now
            const email = (document.querySelector('.login-form input[type="email"]') as HTMLInputElement)?.value || ''
            const map: Record<string, string> = {
              'admin@lab.com': '#/role/admin',
              'manager@lab.com': '#/role/lab-manager',
              'labuser@lab.com': '#/role/lab-user',
              'technician@lab.com': '#/role/technician',
              'service@lab.com': '#/role/service',
              'user@example.com': '#/role/patient',
            }
            const target = map[email.trim().toLowerCase()] || '#/role/user'
            window.location.hash = target
          }}>Đăng nhập vào hệ thống</button>
        </form>

        <div className="forgot">Quên mật khẩu?</div>

        <div className="demo-box">
          <div className="demo-title">
            <span className="dot" /> Tài khoản Demo
          </div>
          <div className="demo-grid">
            <div className="demo-item">
              <div className="demo-label">Quản trị viên:</div>
              <div className="demo-cred"><b>admin@lab.com</b> / admin123</div>
            </div>
            <div className="demo-item">
              <div className="demo-label">Nhân viên Lab:</div>
              <div className="demo-cred"><b>labuser@lab.com</b> / labuser123</div>
            </div>
            <div className="demo-item">
              <div className="demo-label">Trưởng phòng Lab:</div>
              <div className="demo-cred"><b>manager@lab.com</b> / manager123</div>
            </div>
            <div className="demo-item">
              <div className="demo-label">Kỹ thuật viên:</div>
              <div className="demo-cred"><b>technician@lab.com</b> / tech123</div>
            </div>
            <div className="demo-item">
              <div className="demo-label">Kỹ thuật viên Bảo trì:</div>
              <div className="demo-cred"><b>service@lab.com</b> / service123</div>
            </div>
            <div className="demo-item">
              <div className="demo-label">Bệnh nhân:</div>
              <div className="demo-cred"><b>user@example.com</b> / user123</div>
            </div>
          </div>
        </div>

        <div className="login-footer">© 2024 LIMS - Laboratory Information Management System</div>
      </div>

      <img src={viteLogo} className="bg-mark" alt="" />
    </div>
  )
}

function MobileLogin() {
  return (
    <div className="login-root mobile">
      <div className="login-card mobile-card">
        <div className="login-logo">
          <div className="shield">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
              <path fill="currentColor" d="M12 2l7 3v6c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" />
            </svg>
            <span className="status-dot" />
          </div>
        </div>
        <h1 className="login-title">LIMS</h1>
        <div className="login-subtitle"><span>Phòng Thí Nghiệm</span></div>
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label className="field">
            <span className="field-label">Email</span>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 8.2l8 6 8-6V18H4V8.2z"/></svg>
              </span>
              <input type="email" placeholder="Email" required />
            </div>
          </label>
          <label className="field">
            <span className="field-label">Mật khẩu</span>
            <div className="input-wrap">
              <span className="input-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zm-7-2a2 2 0 114 0v2h-4V6zm7 12H7v-8h10v8z"/></svg>
              </span>
              <input type="password" placeholder="Mật khẩu" required />
            </div>
          </label>
          <button className="login-button" type="submit">Đăng nhập</button>
        </form>
        <div className="login-footer">© 2024 LIMS</div>
      </div>
    </div>
  )
}

function LoginPage() {
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches
  useEffect(() => {
    document.body.classList.add('login-body')
    return () => document.body.classList.remove('login-body')
  }, [])
  return isMobile ? <MobileLogin /> : <DesktopLogin />
}

export default LoginPage