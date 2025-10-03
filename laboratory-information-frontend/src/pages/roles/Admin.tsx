import React from 'react'

export const Admin = () => {
  return (
    <div>
      <h2>Admin</h2>
      <button onClick={() => { window.location.hash = '/' }}>Đăng xuất</button>
    </div>
  )
}
