import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import RandomErrorPage from "./pages/RandomErrorPage";
import LoadingPage from "./pages/LoadingPage";
import AdminRoutes from "./routes/AdminRoutes";
import UserHomeRoutes from "./routes/UserHomeRoutes";
import RouteErrorPage from "./pages/RouteErrorPage";
import { useData } from "./context/useData";
import { GetHomeView } from "./api/GetHomeView";

function App() {
  const { dataState, dispatch } = useContext(useData);
  useEffect(() => {
    const getHandleHomeView =async ()=>{
     await GetHomeView(dispatch);
    }
    getHandleHomeView();
  }, [dispatch]);


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
            <Route path="*" element={<RandomErrorPage />} />
          </Routes>
        </>
  );
}

export default App;
