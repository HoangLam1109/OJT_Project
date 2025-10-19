import { RegisterInputField } from './RegisterInputField';
import type { AdditionalInfoFieldsProps } from '../types/register';

export function AdditionalInfoFields({ phone, setPhone, gender, setGender, dob, setDob, idNumber, setIdNumber, address, setAddress }: AdditionalInfoFieldsProps) {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<RegisterInputField 
                           id="phone" 
                           label="Số điện thoại" 
                           type="tel"
                           placeholder="0xxxxxxxxx" 
                           value={phone} 
                           onChange={e => setPhone(e.target.value)} 
                           icon="phone" 
                           inputSize="sm" 
                           required={false} 
                />

				<div className="space-y-2">
					<label className="text-sm text-gray-700"> Giới tính </label>
					<select
						className={`h-10 w-full border border-gray-200 rounded-lg px-3 focus:outline-none focus:border-blue-400 bg-white ${gender ? 'text-gray-900' : 'text-gray-400'}`}
						value={gender}
						onChange={e => setGender(e.target.value)}
					>
						<option value="" disabled>Chọn giới tính</option>
						<option value="male">Nam</option>
						<option value="female">Nữ</option>
						<option value="other">Khác</option>
					</select>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<RegisterInputField 
                            id="dob" 
                            label="Ngày sinh" 
                            type="date" 
                            placeholder="mm/dd/yyyy" 
                            value={dob} 
                            onChange={e => setDob(e.target.value)} 
                            icon="calendar" inputSize="sm" 
                            required={false} />
				<RegisterInputField 
                            id="idNumber"
                            label="CMND/CCCD" 
                            type="text"
                            placeholder="Số CMND/CCCD" 
                            value={idNumber} 
                            onChange={e => setIdNumber(e.target.value)} 
                            icon="id" 
                            inputSize="sm" 
                            required={false} 
                />
			</div>

			<RegisterInputField 
                            id="address"
                            label="Địa chỉ" 
                            type="text"
                            placeholder="Nhập địa chỉ..." 
                            value={address} 
                            onChange={e => setAddress(e.target.value)} 
                            icon="address" 
                            inputSize="sm" 
                            required={false} 
            />
		</>
	);
}
