import { useContext, lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingPage from "./pages/LoadingPage";
import { useData } from "./context/useData";

const RouteErrorPage = lazy(() => import("./pages/RouteErrorPage"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const UserHomeRoutes = lazy(() => import("./routes/UserHomeRoutes"));
const ServerIssuePage = lazy(() => import('./pages/ServerIssuePage'));

function App() {
  const { dataState } = useContext(useData);

  if (dataState.isError) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <RouteErrorPage />
      </Suspense>
    );
  }

  if (dataState.isServerIssue) {
    return (
      <Suspense fallback={<LoadingPage />}>
        <ServerIssuePage />
      </Suspense>
    );
  }

  return dataState.isLoading ? (
    <LoadingPage />
  ) : (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {dataState.isAdmin ? (
          <Route path="/*" element={<AdminRoutes />} />
        ) : (
          <Route path="/*" element={<UserHomeRoutes />} />
        )}
      </Routes>
    </Suspense>
  );
}

export default App;
