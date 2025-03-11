import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import DashboardPage from "./pages/Dashboard";

function App() {
  const routes = createBrowserRouter([
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
          path: "members",
          element: <Members />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
