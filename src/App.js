import AppRoutes from "./routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";



import "./styles/tailwind.css"
function App() {
  return (

<AuthProvider>
<div className="App">  
      <AppRoutes />
</div>
</AuthProvider>
 
  );
}

export default App;
