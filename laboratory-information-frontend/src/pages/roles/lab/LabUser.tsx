import React from 'react'

export const LabUser = () => {
  return (
    <div>
      <h2>LabUser</h2>
      <button onClick={() => { window.location.hash = '/' }}>Đăng xuất</button>
    </div>
  )
}


