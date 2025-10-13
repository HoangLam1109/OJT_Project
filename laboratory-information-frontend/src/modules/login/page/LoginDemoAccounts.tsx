

export function LoginDemoAccounts() {
  return (
    <div className="space-y-4 mt-6">
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-lg border border-gray-100/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <p className="text-sm text-gray-800 font-medium">Tài khoản Demo</p>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Admin:</span>
            <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">
              admin@lab.com / admin123
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Manager:</span>
            <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">
              manager@lab.com / manager123
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service:</span>
            <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">
              service@lab.com / service123
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Manager:</span>
            <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">
              labuser@lab.com / labuser123
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service:</span>
            <span className="text-gray-900 bg-white/70 px-2 py-1 rounded text-xs">
              user@example.com / user123
            </span>
          </div>
        </div>
      </div>

      <div className="text-center pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">© 2024 LIMS - Laboratory Information Management System</p>
      </div>
    </div>
  );
}
