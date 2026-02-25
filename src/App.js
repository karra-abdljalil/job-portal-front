import { Toaster } from "./components/ui/toaster";
import AppRoutes from "@/routes/routes"
import "./styles/tailwind.css";
import { AuthProvider } from "@/contexts/AuthContext";
import "./styles/tailwind.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
