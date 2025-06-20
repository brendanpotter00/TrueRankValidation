import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/section-components/Header";
import { Landing } from "./components/section-components/Landing";
import { Selection } from "./components/section-components/Selection";
import { Ranking } from "./components/section-components/Ranking";
import { Results } from "./components/section-components/Results";
import { Footer } from "./components/Footer";
import { WhyBuilt } from "./components/WhyBuilt";
import type { RootState } from "./types/reduxTypes";

function App() {
  const currentStep = useSelector(
    (state: RootState) => state.parks.currentStep
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">
            <Header />
            <main className="flex-grow">
              {currentStep === "selection" && <Landing />}
              {currentStep === "selection" && <Selection />}
              {currentStep === "ranking" && <Ranking />}
              {currentStep === "results" && <Results />}
            </main>
            {currentStep !== "ranking" && <Footer />}
          </div>
        }
      />
      <Route path="/why-built" element={<WhyBuilt />} />
    </Routes>
  );
}

export default App;
