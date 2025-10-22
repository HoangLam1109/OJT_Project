import React, { useState } from 'react';
import Button from '../../components/common/button';
import { Alert, AlertDescription } from '../../components/common/alert';
import { RegisterHeader } from './RegisterHeader';
import { PersonalInfoFields } from './PersonalInfoFields';
import { AdditionalInfoFields } from './AdditionalInfoFields';
import { FooterActions } from './FooterActions';
import type { RegisterFormProps } from './types/register';
import { isValidEmail, isValidPhone, validatePassword } from './types/validators';
import { registerUser } from '../../service/authService/registerAPI';

export function RegisterForm({ onBackToLogin, onBackToHome }: RegisterFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validation
    if (!fullName || !email || !password || !confirmPassword || !idNumber || !gender || !dob) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc');
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError('Địa chỉ email không hợp lệ');
      setIsLoading(false);
      return;
    }
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setIsLoading(false);
      return;
    }
    if (phone && !isValidPhone(phone)) {
      setError('Số điện thoại phải có 10-11 chữ số');
      setIsLoading(false);
      return;
    }

    // Calculate age from date of birth
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const calculatedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;

    try {
      const registerData = {
        email,
        fullName,
        identityNumber: idNumber,
        gender,
        age: calculatedAge,
        dateOfBirth: dob,
        password,
      };

      const result = await registerUser(registerData);

      if (result.success) {
        setSuccessMessage(result.message);
        // Clear form
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setGender('');
        setDob('');
        setIdNumber('');
        setAddress('');
        setPasswordError('');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 pt-6 pb-2 text-center">
            <RegisterHeader />
          </div>
          <div className="px-5 pb-4 space-y-2">
            <form onSubmit={handleSubmit} className="space-y-2">
              <PersonalInfoFields
                fullName={fullName} setFullName={setFullName}
                email={email} setEmail={setEmail}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                passwordError={passwordError} handlePasswordChange={handlePasswordChange}
              />
              <AdditionalInfoFields
                phone={phone} setPhone={setPhone}
                gender={gender} setGender={setGender}
                dob={dob} setDob={setDob}
                idNumber={idNumber} setIdNumber={setIdNumber}
                address={address} setAddress={setAddress}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
              </Button>
              <FooterActions onBackToLogin={onBackToLogin} onBackToHome={onBackToHome} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
