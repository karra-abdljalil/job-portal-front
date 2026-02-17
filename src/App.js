import { Toaster } from "./components/ui/toaster";
import AppRoutes from "./routes/routes";
import "./styles/tailwind.css"
function App() {
  return (
    <div className="App">
<AppRoutes/>
<Toaster/>
    </div> 
  );
}

export default App;
