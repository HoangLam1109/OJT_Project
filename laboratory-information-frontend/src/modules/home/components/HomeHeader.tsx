import { Microscope, ArrowRight } from "lucide-react";
import Button from "../../../components/common/button";
import type { LoginType } from "../../../types";


export function HomeHeader({ onShowLogin }: LoginType) {
  return (
    <header className="px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
            <Microscope className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900 font-semibold">LIMS Pro</h1>
            <p className="text-sm text-gray-600">Laboratory Information Management System</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
        
          <Button
            onClick={onShowLogin}
            className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-black hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Đăng nhập
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
