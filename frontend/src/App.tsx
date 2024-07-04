import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import TaskList from "./pages/task/TaskList";
import NotFound from "./pages/common/NotFound";
import TaskForm from "./pages/task/TaskForm";
import Settings from "./pages/Settings";
import Login from "./pages/auth/Login";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
