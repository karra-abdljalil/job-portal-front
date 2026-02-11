import AppRoutes from "./routes/routes";
import "./styles/tailwind.css"
import { Button } from "./components/ui/button"
function App() {
  return (
    <div className="App">
omar 
<Button>Cliquez ici</Button>
      <Button variant="secondary">Bouton secondaire</Button>
      <Button variant="destructive">Supprimer</Button>
    </div> 
  );
}

export default App;
