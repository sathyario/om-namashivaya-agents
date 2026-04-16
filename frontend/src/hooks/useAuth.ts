// Thin wrapper — reads from the single AuthProvider at the top of the app.
// All existing imports (useAuth) continue to work unchanged.
export { useAuthContext as useAuth } from '../contexts/AuthContext'
