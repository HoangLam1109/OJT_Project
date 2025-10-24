import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallbackFromData, handleGoogleCallback } from '../../service/authService/googleOAuthApi';
import { useAuthContext } from '../../hooks/useAuthContext';
import type { User } from '../../types/User';

// Function để xác định redirect path dựa trên role
function getRedirectPathByRole(role: User['role']): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'MANAGER':
      return '/manager';
    case 'LAB_USER':
      return '/labuser';
    case 'SERVICE':
      return '/service';
    case 'USER':
    default:
      return '/user'; // Normal User
  }
}

export function GoogleCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { onLogin } = useAuthContext();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Kiểm tra xem có response data trong URL không
        const urlParams = new URLSearchParams(window.location.search);
        const responseData = urlParams.get('data');
        
        if (responseData) {
          // Parse response data từ URL
          const parsedData = JSON.parse(decodeURIComponent(responseData));
          
          // Xử lý user data
          const user = handleGoogleCallbackFromData(parsedData);
          
          if (user) {
            // Login user
            onLogin(user);
            
            // Redirect dựa trên role của user
            const redirectTo = getRedirectPathByRole(user.role);
            navigate(redirectTo);
          } else {
            setError('Không thể xử lý thông tin đăng nhập');
          }
        } else {
          // Kiểm tra xem có phải đang ở trang callback với code/state không
          const code = urlParams.get('code');
          const state = urlParams.get('state');
          
          if (code && state) {
            // Gọi API để xử lý callback
            const user = await handleGoogleCallback();
            if (user) {
              onLogin(user);
              // Redirect dựa trên role của user
              const redirectTo = getRedirectPathByRole(user.role);
              navigate(redirectTo);
            } else {
              setError('Không thể xử lý đăng nhập Google');
            }
          } else {
            setError('Không tìm thấy thông tin đăng nhập');
          }
        }
      } catch (err) {
        console.error('Google OAuth callback error:', err);
        setError('Có lỗi xảy ra khi đăng nhập');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, onLogin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xử lý đăng nhập Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập thất bại</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return null;
}
