import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage";
import AdminRoutes from "./routes/AdminRoutes";
import UserHomeRoutes from "./routes/UserHomeRoutes";
import RouteErrorPage from "./pages/RouteErrorPage";
import { useData } from "./context/useData";

function App() {
  const { dataState } = useContext(useData);

  return (
    dataState.isError ? <RouteErrorPage />
      :
      dataState.isLoading ? <LoadingPage />
        :
        <>
          <Routes>
            {dataState.isAdmin ? (
              <Route path="/*" element={<AdminRoutes />} />
            ) : (
              <Route path="/*" element={<UserHomeRoutes />} />
            )}

          </Routes>
        </>
  );
}

export default App;
