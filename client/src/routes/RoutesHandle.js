import React, { useContext, useMemo } from 'react';
import { Routes, Route } from "react-router-dom";
import { useData } from '../context/useData';

//* Lazy load components to improve performance by loading only when needed
const RouteErrorPage = React.lazy(() => import('../pages/RouteErrorPage'));
const RandomErrorPage = React.lazy(() => import('../pages/RandomErrorPage'));
const LoadingPage = React.lazy(() => import('../pages/LoadingPage'));
const AdminRoutes = React.lazy(() => import('../routes/AdminRoutes'));
const ServerIssuePage = React.lazy(() => import('../pages/ServerIssuePage'));
const UserHomeRoutes = React.lazy(() => import('../routes/UserHomeRoutes'));

const RoutesHandle = () => {
  const { dataState } = useContext(useData);

  //* useMemo to memoize condition-based component rendering
  const renderContent = useMemo(() => {
    if (dataState.isError) {
      return <RandomErrorPage />;
    } else if (dataState.isLoading) {
      return <LoadingPage />;
    } else if (dataState.isServerIssue) {
      return <ServerIssuePage />;
    } else {
      return (
        <Routes>
          {dataState.isAdmin ? (
            <Route path="/*" element={<AdminRoutes />} />
          ) : (
            <Route path="/*" element={<UserHomeRoutes />} />
          )}
          <Route path="*" element={<RouteErrorPage />} />
        </Routes>
      );
    }
  }, [dataState]);

  return (
    <React.Suspense fallback={<LoadingPage />}>
      {renderContent}
    </React.Suspense>
  );
};

export default React.memo(RoutesHandle);
