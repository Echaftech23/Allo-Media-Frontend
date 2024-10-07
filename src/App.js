import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/auth/AuthContext';
import Router from "./routes/index";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;