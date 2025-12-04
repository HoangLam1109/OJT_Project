import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallbackFromData, handleGoogleCallback, handleGoogleCallbackFromHash, cleanGoogleCallbackUrl } from '../../service/authService/googleOAuthApi';
import { useAuthContext } from '../../hooks/useAuthContext';
import type { User } from '../../types/User';

// Function để xác định redirect path dựa trên role
function getRedirectPathByRole(roleArray: User['role']): string {
  if (!roleArray || roleArray.length === 0) return '/home';

  const role = roleArray[0]; // Lấy role đầu tiên

  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'MANAGER':
      return '/manager';
    case 'SERVICE':
      return '/service';
    case 'LAB_USER':
      return '/labuser';
    case 'USER':
      return '/user';
    default:
      return '/home';
  }
}

export function GoogleCallbackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { onLogin } = useAuthContext();

  useEffect(() => {
    let mounted = true;
    let processed = false;
    const MAX_WAIT_MS = 800; // short wait to avoid flicker
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tryProcessCallback = async (): Promise<boolean> => {
      try {
        // Priority 1: Xử lý hash fragment (#accessToken=...&refreshToken=...&user=...)
        // Backend trả về callback với hash fragment
        if (window.location.hash && window.location.hash.length > 1) {
          const hash = window.location.hash.substring(1);
          const hashParams = new URLSearchParams(hash);
          
          // Kiểm tra xem có accessToken và user trong hash không
          if (hashParams.has('accessToken') && hashParams.has('user')) {
            console.log('[GoogleCallback] Processing hash fragment callback...');
            const user = handleGoogleCallbackFromHash();
            
            if (user) {
              console.log('[GoogleCallback] ✓ User authenticated from hash fragment');
              onLogin(user);
              // Clean hash fragment sau khi xử lý thành công
              cleanGoogleCallbackUrl();
              const redirectTo = getRedirectPathByRole(user.role);
              console.log('[GoogleCallback] Redirecting to:', redirectTo);
              navigate(redirectTo);
              processed = true;
              return true;
            } else {
              setError('Không thể xử lý thông tin đăng nhập từ hash fragment');
              return false;
            }
          }
        }

        // Priority 2: Xử lý query parameter 'data' (JSON encoded)
        const urlParams = new URLSearchParams(window.location.search);
        const responseData = urlParams.get('data');

        if (responseData) {
          console.log('[GoogleCallback] Processing query parameter data...');
          try {
            // Parse response data từ URL
            const parsedData = JSON.parse(decodeURIComponent(responseData));
      
            // Xử lý user data
            const user = handleGoogleCallbackFromData(parsedData);

            if (user) {
              console.log('[GoogleCallback] ✓ User authenticated from query data');
              onLogin(user);
              cleanGoogleCallbackUrl();
              const redirectTo = getRedirectPathByRole(user.role);
              navigate(redirectTo);
              processed = true;
              return true;
            } else {
              setError('Không thể xử lý thông tin đăng nhập');
              return false;
            }
          } catch (parseError) {
            console.error('[GoogleCallback] Failed to parse response data:', parseError);
            setError('Dữ liệu đăng nhập không hợp lệ');
            return false;
          }
        }

        // Priority 3: Xử lý OAuth code/state flow (standard OAuth)
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code && state) {
          console.log('[GoogleCallback] Processing OAuth code flow...');
          const user = await handleGoogleCallback();
          if (user) {
            console.log('[GoogleCallback] ✓ User authenticated from OAuth code');
            onLogin(user);
            cleanGoogleCallbackUrl();
            const redirectTo = getRedirectPathByRole(user.role);
            navigate(redirectTo);
            processed = true;
            return true;
          } else {
            setError('Không thể xử lý đăng nhập Google');
            return false;
          }
        }

        // Nothing to process
        console.warn('[GoogleCallback] No valid callback parameters found');
        return false;
      } catch (err) {
        console.error('[GoogleCallback] Unexpected error:', err);
        setError(`Có lỗi xảy ra khi đăng nhập: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return false;
      }
    };

    const onUrlChange = async () => {
      if (processed || !mounted) return;
      const ok = await tryProcessCallback();
      if (ok) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        setLoading(false);
      }
    };

    // First attempt immediately
    (async () => {
      const ok = await tryProcessCallback();
      if (ok) {
        setLoading(false);
        return;
      }

      // Wait a little before showing an error; during this time listener can pick up redirects
      timer = setTimeout(() => {
        if (!processed) {
          setError('Không tìm thấy thông tin đăng nhập');
          setLoading(false);
        }
      }, MAX_WAIT_MS);
    })();

    window.addEventListener('popstate', onUrlChange);
    // Also listen hashchange just in case
    window.addEventListener('hashchange', onUrlChange);

    return () => {
      mounted = false;
      if (timer) clearTimeout(timer);
      window.removeEventListener('popstate', onUrlChange);
      window.removeEventListener('hashchange', onUrlChange);
    };
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
