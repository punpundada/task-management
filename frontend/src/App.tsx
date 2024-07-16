import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import TaskList from "./pages/task/list/TaskList";
import NotFound from "./pages/common/NotFound";
import TaskForm from "./pages/task/TaskForm";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import React, { Suspense } from "react";
import { useAuthContext } from "./context/AuthContext";
import { User } from "./types/user";
import ProtectedRoute from "./pages/common/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

const Profile = React.lazy(()=>import("@/pages/user/Profile"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <TaskList />,
      },
      {
        path: "add",
        element: <TaskForm />,
      },
      {
        path: "edit/:id",
        element: <TaskForm />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path:"user",
        children:[
          {
            path:"profile",
            element:<Suspense fallback={<>...Loading</>}><Profile/></Suspense>
          }
        ]
      }
    ],
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const { setData } = useAuthContext();

  React.useEffect(() => {
    if (!window?.localStorage) return;
    const user: User = JSON.parse(window.localStorage.getItem("user") ?? "{}");
    if (!user?.id) {
      setData({ isAuthenticated: false, user: undefined });
      window.localStorage.removeItem("user");
    } else {
      setData({ isAuthenticated: true, user: user });
    }
  }, [setData]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
