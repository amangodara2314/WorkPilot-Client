import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import MainPage from "./pages/MainPage";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import DashboardPage from "./pages/Dashboard";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import GoogleAuthProvider from "./components/auth/GoogleAuthProvider";
import RouteHandler from "./components/RouteHandler";
import { useGlobalContext } from "./context/GlobalContext";
import { useEffect } from "react";
import ShowTask from "./pages/ShowTask";
import Project from "./pages/Project";
import JoinWorkshop from "./pages/JoinWorkshop";
import NotFound from "./pages/NotFound";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <RouteHandler />,
      children: [
        {
          path: "/workshop/:id/",
          element: <MainPage />,
          children: [
            {
              path: "",
              element: <DashboardPage />,
            },
            {
              path: "tasks",
              element: <Tasks />,
            },
            {
              path: "tasks/:taskId",
              element: <ShowTask />,
            },
            {
              path: "members",
              element: <Members />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
            {
              path: "project/:projectId",
              element: <Project />,
            },
          ],
        },
      ],
    },
    {
      path: "/auth/",
      element: <GoogleAuthProvider />,
      children: [
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/workshop/join/:code",
      element: <JoinWorkshop />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
