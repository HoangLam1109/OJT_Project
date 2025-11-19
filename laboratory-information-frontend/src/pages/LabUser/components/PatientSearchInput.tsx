import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, User } from 'lucide-react';
import { Input } from '../../../components/common/input';
import { patientService, type PatientOption } from '../../../service/patientService';

interface PatientSearchInputProps {
  value: string;
  onChange: (patientName: string, patientId?: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const PatientSearchInput: React.FC<PatientSearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm bệnh nhân...',
  error,
  disabled = false,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim().length === 0) {
      setPatients([]);
      setShowDropdown(false);
      return;
    }

    if (searchTerm.trim().length < 2) {
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await patientService.getAllPatients({
          search: searchTerm.trim(),
          limit: 10,
          isActive: true,
          populateUser: true,
        });
        setPatients(results);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error searching patients:', error);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
  };

  const handleSelectPatient = (patient: PatientOption) => {
    setSearchTerm(patient.fullName);
    onChange(patient.fullName, patient.id);
    setShowDropdown(false);
    setPatients([]);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setPatients([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || patients.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < patients.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < patients.length) {
          handleSelectPatient(patients[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (patients.length > 0) {
              setShowDropdown(true);
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full !pl-11 !pr-10 rounded-lg border py-2.5 text-sm transition-all duration-200 ${
            error
              ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500'
              : showDropdown
              ? 'border-blue-400 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500'
              : 'border-gray-300 bg-white hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500'
          } focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed`}
        />
        {searchTerm && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all duration-200"
            aria-label="Xóa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-hidden transition-all duration-200 ease-out opacity-100 transform scale-100">
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Đang tìm kiếm...</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="p-6 text-center">
                <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">Không tìm thấy bệnh nhân</p>
                <p className="text-xs text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <ul className="py-2">
                {patients.map((patient, index) => (
                  <li
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`px-4 py-3 cursor-pointer transition-all duration-150 ${
                      index === selectedIndex
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {patient.fullName}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          {patient.patientCode && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Mã:</span>
                              <span className="font-mono">{patient.patientCode}</span>
                            </span>
                          )}
                          {patient.phoneNumber && (
                            <span className="flex items-center gap-1">
                              <span className="font-medium">SĐT:</span>
                              <span>{patient.phoneNumber}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
          <span>•</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

