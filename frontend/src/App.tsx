import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Flip, ToastContainer } from "react-toastify";
import AppLayout from './layouts/AppLayout';
import LoginForm from './views/Login';
import RegisterForm from './views/Register';
// Import des pages (à créer)
// import Dashboard from './pages/Dashboard';
// import NotesPage from './pages/NotesPage';
// import NoteEditor from './pages/NoteEditor';
// import SharedNotes from './pages/SharedNotes';
// import SearchPage from './pages/SearchPage';
// import PublicNote from './pages/PublicNote';

// Composants temporaires pour les pages non encore créées
const Dashboard = () => (
  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-secondary-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Tableau de bord</h2>
          <p className="text-secondary-600">Vue d'ensemble de vos notes</p>
        </div>
      </div>
    </div>
  </div>
);

const NotesPage = () => (
  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-secondary-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Mes Notes</h2>
          <p className="text-secondary-600">Liste de toutes vos notes</p>
        </div>
      </div>
    </div>
  </div>
);

const NoteEditor = () => (
  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-secondary-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Éditeur de note</h2>
          <p className="text-secondary-600">Créer ou modifier une note</p>
        </div>
      </div>
    </div>
  </div>
);

const SharedNotes = () => (
  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-secondary-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Notes partagées</h2>
          <p className="text-secondary-600">Notes partagées avec vous</p>
        </div>
      </div>
    </div>
  </div>
);

const SearchPage = () => (
  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-secondary-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Recherche</h2>
          <p className="text-secondary-600">Rechercher dans vos notes</p>
        </div>
      </div>
    </div>
  </div>
);

const PublicNote = () => (
  <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-secondary-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-2">Note publique</h2>
          <p className="text-secondary-600">Affichage d'une note publique</p>
        </div>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-secondary-900 mb-4">404</h1>
      <p className="text-xl text-secondary-600 mb-8">Page non trouvée</p>
      <a
        href="/dashboard"
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Retour au tableau de bord
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/public/:token" element={<PublicNote />} />

              {/* Routes protégées */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="notes/new" element={<NoteEditor />} />
                <Route path="notes/:id" element={<NoteEditor />} />
                <Route path="shared" element={<SharedNotes />} />
                <Route path="search" element={<SearchPage />} />
              </Route>

              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        <ToastContainer autoClose={8000} transition={Flip} />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;