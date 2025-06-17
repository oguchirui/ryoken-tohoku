import { useRoutes } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import RecordPage from "@/pages/record/RecordPage";
import EditPage from "@/pages/edit/EditPage";
import AboutPage from "@/pages/about/AboutPage";

const Router = () => {
  const routingConfig = [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/record",
      element: <RecordPage />,
    },
    {
      path: "/edit",
      element: <EditPage />,
    },
    {
      path: "/about",
      element: <AboutPage />,
    }
  ];

  const routing = useRoutes(routingConfig);

  return routing;
};

export default Router;
