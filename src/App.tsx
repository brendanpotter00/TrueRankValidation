import { useSelector } from "react-redux";
import { Landing } from "./components/Landing";
import { Selection } from "./components/Selection";
import { Ranking } from "./components/Ranking";
import { Results } from "./components/Results";
import type { RootState } from "./store/types";

function App() {
  const currentStep = useSelector(
    (state: RootState) => state.parks.currentStep
  );

  return (
    <div className="app">
      {currentStep === "selection" && <Landing />}
      {currentStep === "selection" && <Selection />}
      {currentStep === "ranking" && <Ranking />}
      {currentStep === "results" && <Results />}
    </div>
  );
}

export default App;
