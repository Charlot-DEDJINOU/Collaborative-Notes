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

export default NotFound;