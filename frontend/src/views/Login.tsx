import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import type { LoginCredentials } from '../types/authentification';
import type { ValidationError } from '../types/form';
import Button from '../components/commons/Button';
import Input from '../components/commons/Input';
import { errorMessage, onServerSuccess } from '../services/helper';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateLoginForm = (values: LoginCredentials): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!values.email) {
      errors.push({ field: 'email', message: 'L\'email est requis' });
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.push({ field: 'email', message: 'Format d\'email invalide' });
    }

    if (!values.password) {
      errors.push({ field: 'password', message: 'Le mot de passe est requis' });
    } else if (values.password.length < 6) {
      errors.push({ field: 'password', message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validateLoginForm,
    onSubmit: async (formValues) => {
      try {
        await login(formValues);
        onServerSuccess('Connexion réussie.\n Bienvenue dans votre espace notes !');
        navigate('/dashboard');
      } catch (err) {
        console.log(err)
        errorMessage(err)
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Ou{' '}
            <Link
              to="/register"
              className="font-medium text-secondary hover:text-primary-600 transition-colors duration-200"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              placeholder="votre@email.com"
              value={values.email}
              onChange={(value) => handleChange('email', value)}
              error={errors.email}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={values.password}
              onChange={(value) => handleChange('password', value)}
              error={errors.password}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-primary hover:text-primary-600 transition-colors duration-200"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary-50 text-secondary-500">
                Application de gestion de notes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;