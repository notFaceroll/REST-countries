import {Router} from "./router";
import {CountriesProvider} from "@/context/CountriesContext.tsx";

function App() {
  return (
    <CountriesProvider>
      <Router/>
    </CountriesProvider>
  );
}

export default App;
