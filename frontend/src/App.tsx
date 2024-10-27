import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import React, { Suspense } from "react";
import { useAuthContext } from "./context/AuthContext";
import { User } from "./types/user";
import ProtectedRoute from "./pages/common/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import Dashboard from "./pages/dashboard/Dashboard";

const Profile = React.lazy(()=>import("@/pages/user/Profile"));
const Signup = React.lazy(()=>import('./pages/auth/Signup'))
const Login = React.lazy(()=>import("./pages/auth/Login"))
const TaskForm = React.lazy(()=>import("./pages/task/TaskForm"))
const TaskList = React.lazy(()=>import("./pages/task/list/TaskList"))
const Settings = React.lazy(()=>import("./pages/Settings"))
const NotFound = React.lazy(()=>import("./pages/common/NotFound"))

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
        element: <Suspense fallback={<>...Loading</>}><Dashboard /></Suspense>,
        // element: <Suspense fallback={<>...Loading</>}><TaskList /></Suspense>,
      },
      {
        // index: true,
        path:"tasks",
        element: <Suspense fallback={<>...Loading</>}><TaskList /></Suspense>,
      },
      {
        path: "tasks/add",
        element: <Suspense fallback={<>...Loading</>}><TaskForm /></Suspense>,
      },
      {
        path: "tasks/edit/:id",
        element: <Suspense fallback={<>...Loading</>}><TaskForm /></Suspense>,
      },
      {
        path: "settings",
        element: <Suspense fallback={<>...Loading</>}><Settings /></Suspense>,
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
        element: <Suspense fallback={<>...Loading</>}><Login /></Suspense>,
      },
      {
        path: "signup",
        element: <Suspense fallback={<>...Loading</>}><Signup /></Suspense>,
      },
    ],
  },
  {
    path: "*",
    element: <Suspense fallback={<>...Loading</>}><NotFound /></Suspense>,
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
