import React from 'react'

export const Patient = () => {
  return (
    <div>
      <h2>Patient</h2>
      <button onClick={() => { window.location.hash = '/' }}>Đăng xuất</button>
    </div>
  )
}


