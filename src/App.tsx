import { Suspense, lazy } from "react";
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import CustomLayout from "./components/layout/CustomLayout";
import { useAuthContext } from "./context/AuthProvider";
import { routes } from "./utils/constant";

const NotFound = lazy(() => import("./pages/NotFound"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ChartPage = lazy(() => import("./pages/ChartPage"));

const AddUserPage = lazy(() => import("./pages/user/AddUserPage"));
const DetailUserPage = lazy(() => import("./pages/user/DetailUserPage"));
const TableUserPage = lazy(() => import("./pages/user/TableUserPage"));

const AddCategoryPage = lazy(() => import("./pages/category/AddCategoryPage"));
const DetailCategoryPage = lazy(() => import("./pages/category/DetailCategoryPage"));
const TableCategoryPage = lazy(() => import("./pages/category/TableCategoryPage"));

const AddProductPage = lazy(() => import("./pages/product/AddProductPage"));
const TableProductPage = lazy(() => import("./pages/product/TableProductPage"));
const DetailProductPage = lazy(() => import("./pages/product/DetailProductPage"));

function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? (
    <CustomLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </CustomLayout>
  ) : (
    <Navigate to="/login" />
  );
}

function RejectedRoute() {
  const { isAuthenticated } = useAuthContext();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

const router = createBrowserRouter([
  {
    path: routes.login,
    element: <RejectedRoute />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      {
        path: routes.home,
        children: [
          {
            path: "add",
            element: <AddUserPage />,
          },
          {
            path: ":id",
            element: <DetailUserPage />,
          },
          {
            path: "",
            element: <TableUserPage />,
          },
        ],
      },

      {
        path: routes.product,
        children: [
          {
            path: "add",
            element: <AddProductPage />,
          },
          {
            path: ":id",
            element: <DetailProductPage />,
          },
          {
            path: "",
            element: <TableProductPage />,
          },
        ],
      },
      {
        path: routes.category,
        children: [
          {
            path: "add",
            element: <AddCategoryPage />,
          },
          {
            path: ":id",
            element: <DetailCategoryPage />,
          },
          {
            path: "",
            element: <TableCategoryPage />,
          },
        ],
      },
      {
        path: routes.report,
        element: <ChartPage />,
      },
    ],
  },
  {
    path: routes.notFound,
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
