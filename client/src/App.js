import { useContext } from "react";
import RandomErrorPage from "./pages/RandomErrorPage";
import LoadingPage from "./pages/LoadingPage";
import AdminRoutes from "./routes/AdminRoutes";
import { Route, Routes } from "react-router-dom";
import UserHomeRoutes from "./routes/UserHomeRoutes";
import RouteErrorPage from "./pages/RouteErrorPage";
import { useData } from "./context/useData";
function App() {
  const { dataState, dispatch} = useContext(useData);
  
    const isAdmin = true;
    const isError = false;
    const isLoading = false;


  return (
    isError ? <RandomErrorPage />
      :
      isLoading ? <LoadingPage />
        :
        <>
          <Routes>
            {isAdmin ? (
              <Route path="/*" element={<AdminRoutes />} />
            ) : (
              <Route path="/*" element={<UserHomeRoutes />} />
            )}
            <Route path="*" element={<RouteErrorPage />} />
          </Routes></>
  )
}

export default App;
