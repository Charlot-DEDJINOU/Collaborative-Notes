import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Flip, ToastContainer } from "react-toastify";
import AppLayout from './layouts/AppLayout';
import LoginForm from './views/Login';
import RegisterForm from './views/Register';
import Notes from './views/Notes';
import NotFound from './views/NotFound';
import NoteEditor from './views/NoteEditor';
import PublicNote from './views/PublicNote';
// Import des pages (à créer)
// import Dashboard from './pages/Dashboard';
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
              <Route path="/public/:publicToken" element={<PublicNote />} />

              {/* Routes protégées */}
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="notes/:type" element={<Notes />} />
                <Route path="notes/new" element={<NoteEditor />} />
                <Route path="notes/edit/:noteId" element={<NoteEditor />} />
                <Route path='notes/show/:noteId' element={<NoteEditor />} />
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