import React from 'react';
import { Input } from '../common/input';
import { Label } from '../common/label';
import { Mail, Lock } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: 'mail' | 'lock';
}

export function LoginInputField({ id, label, type = 'text', placeholder, value, onChange, icon }: Props) {
  const Icon = icon === 'mail' ? Mail : icon === 'lock' ? Lock : null;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="pl-10 h-12 border-gray-200 focus:border-blue-400 rounded-lg"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
