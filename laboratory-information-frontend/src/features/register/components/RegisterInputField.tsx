
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Mail, Lock, User, Phone, Calendar, IdCard, MapPin } from 'lucide-react';
import type { RegisterInputFieldProps } from '../types/register';

export function RegisterInputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  required = true,
  inputSize = 'md',
}: RegisterInputFieldProps) {
  const Icon =
    icon === 'mail' ? Mail :
    icon === 'lock' ? Lock :
    icon === 'user' ? User :
    icon === 'phone' ? Phone :
    icon === 'calendar' ? Calendar :
    icon === 'id' ? IdCard :
    icon === 'address' ? MapPin :
    null;

  const heightClass = inputSize === 'sm' ? 'h-10' : 'h-11';

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`pl-10 ${heightClass} border-gray-200 focus:border-blue-400 rounded-lg`}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
}
