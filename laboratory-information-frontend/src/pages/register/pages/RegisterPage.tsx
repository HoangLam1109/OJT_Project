
import { RegisterForm } from './RegisterForm';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
	const navigate = useNavigate();

	return (
		<RegisterForm
			onBackToLogin={() => navigate('/login')}
			onBackToHome={() => navigate('/')}
		/>
	);
}
