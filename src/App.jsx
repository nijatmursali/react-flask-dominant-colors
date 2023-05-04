import AppProvider from "./contexts/appContext";
import Home from "./pages/home";

function App() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}

export default App;
