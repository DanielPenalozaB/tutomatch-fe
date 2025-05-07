import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '@/features/login/login-form';
import { useRouter } from 'next/navigation';

// Mock the dependencies
jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('sonner', () => ({
  toast: jest.fn()
}));

describe('LoginForm', () => {
  const mockRouter = {
    refresh: jest.fn(),
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the login form with all required elements', () => {
    render(<LoginForm />);

    // Check for header text
    expect(screen.getByText('Bienvenido a TutoMatch')).toBeInTheDocument();
    expect(screen.getByText('Ingresa tus credenciales para iniciar sesión')).toBeInTheDocument();

    // Check for form inputs
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contrase/i)).toBeInTheDocument();

    // Check for button
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();

    // Check for links
    expect(screen.getByText(/olvidaste tu contrase/i)).toBeInTheDocument();
    expect(screen.getByText(/no tienes una cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/regístrate/i)).toBeInTheDocument();

    // Check for terms
    expect(screen.getByText(/al iniciar sesión aceptas nuestros/i)).toBeInTheDocument();
    expect(screen.getByText(/términos de uso/i)).toBeInTheDocument();
    expect(screen.getByText(/políticas de privacidad/i)).toBeInTheDocument();
  });

  it('updates form data when user types in inputs', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contrase/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
