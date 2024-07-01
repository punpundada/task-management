import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import TaskList from "./pages/task/TaskList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TaskList />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
