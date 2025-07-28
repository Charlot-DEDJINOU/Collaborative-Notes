import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import type { RegisterCredentials } from '../types/authentification';
import type { ValidationError } from '../types/form';
import Button from '../components/commons/Button';
import Input from '../components/commons/Input';
import { errorMessage, onServerSuccess } from '../services/helper';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateRegisterForm = (values: RegisterCredentials): ValidationError[] => {
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

    if (!values.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'La confirmation du mot de passe est requise' });
    } else if (values.password !== values.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Les mots de passe ne correspondent pas' });
    }

    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm<RegisterCredentials>({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validateRegisterForm,
    onSubmit: async (formValues) => {
      try {
        await register(formValues);
        onServerSuccess('Inscription réussie');
        navigate('/dashboard');
      } catch (err) {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Créer votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary-600 transition-colors duration-200"
            >
              connectez-vous à votre compte existant
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

            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-secondary-900">
              J'accepte les{' '}
              <a
                href="#"
                className="font-medium text-primary hover:text-primary-600 transition-colors duration-200"
              >
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a
                href="#"
                className="font-medium text-primary hover:text-primary-600 transition-colors duration-200"
              >
                politique de confidentialité
              </a>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Création du compte...' : 'Créer mon compte'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-secondary-50 text-secondary-500">
                Rejoignez des milliers d'utilisateurs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;