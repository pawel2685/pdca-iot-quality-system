import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import SignInPage from "./pages/SignInPage";
import logo from "./assets/images/logo.png";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/" element={
          <div className="min-h-screen text-slate-100" style={{ backgroundColor: '#2e2e2e' }}>
            <header className="flex items-center gap-6 px-6 py-4 border-b shadow-lg" style={{ backgroundColor: '#34495e', borderColor: '#000000' }}>
              <div className="flex-shrink-0">
                <img src={logo} alt="Logo" className="h-16 w-auto rounded-lg" />
              </div>
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold">PDCA Alert Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button className="px-6 py-2 rounded-lg font-semibold text-slate-100 border-2 border-slate-300 hover:bg-slate-300 hover:text-slate-900 transition-colors">
                  Sign Up
                </button>
                <Link to="/sign-in">
                  <button className="px-6 py-2 rounded-lg font-semibold bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors">
                    Sign In
                  </button>
                </Link>
              </div>
            </header>
            
            <main className="p-6">
              <DashboardPage />
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
