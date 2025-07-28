import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import type { AxiosError } from 'axios'

// Constantes
const NETWORK_ERROR_MESSAGE = "Network Error";
const TOKEN_ERROR_MESSAGES = ["Token expired or invalid", "Unauthorized"];
const REDIRECT_URL = import.meta.env.VITE_APP_URI_BASE as string;
const GENERAL_ERROR_MESSAGE = "Une erreur est intervenue lors de l'opération";
const AUTH_ERROR_MESSAGE = "Veuillez-vous connecter";

// Fonctions utilitaires
const clearSessionAndRedirect = (message: string): void => {
  onServerWarning(message); // Log the reason for logout
  localStorage.clear();
  window.location.href = REDIRECT_URL;
};

// Fonction principale de gestion des erreurs
export const errorMessage = (error: AxiosError<any> | unknown): void => {
  if (!error || (typeof error !== 'object') || !(error as any).response) {
    console.error("Unexpected error format:", error);
    onServerError("Une erreur inconnue s'est produite.");
    return;
  }

  const axiosErr = error as AxiosError<any>
  const status = axiosErr.response?.status
  const data = axiosErr.response?.data as { details?: Array<any>; error?: string }
  const message = data.error || ''

  if (message === NETWORK_ERROR_MESSAGE) {
    onServerWarning("Vérifiez votre connexion.");
  } else if (TOKEN_ERROR_MESSAGES.includes(message || "")) {
    clearSessionAndRedirect(AUTH_ERROR_MESSAGE);
  } else if (status === 500) {
    onServerError(GENERAL_ERROR_MESSAGE);
  } else if (status === 422) {
    onServerError("Veuillez remplir tous les champs");
  } else if ([404, 403, 401, 400].includes(status ?? 0)) {
    onServerError(message || "Une erreur s'est produite.");
  } else {
    console.warn("Unhandled error status:", status);
    onServerError("Une erreur inconnue s'est produite.");
  }
};

/**
 * Store a string value in localStorage
 */
export function storeData(
  key: string,
  value: string
): void {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('Error storing data: ', error)
  }
}

/**
 * Retrieve a string value from localStorage
 */
export function getData(
  key: string
): string | null {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error retrieving data: ', error)
    return null
  }
}

/**
 * Remove an item from localStorage
 */
export function removeData(
  key: string
): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing data: ', error)
  }
}

// Fonctions de notification
export const onServerError = (description: string): void => {
  toast.error(description, {
    position: "top-right",
    theme: "light"
  });
};

export const onServerSuccess = (description: string): void => {
  toast.success(description, {
    position: "top-right",
    theme: "light"
  });
};

export const onServerWarning = (description: string): void => {
  toast.warn(description, {
    position: "top-right",
    theme: "light"
  });
};