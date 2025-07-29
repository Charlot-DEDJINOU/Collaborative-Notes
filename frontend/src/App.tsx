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
import Dashboard from './views/Dashboard';



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