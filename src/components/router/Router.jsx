import { useRoutes } from "react-router-dom";
import HomePage from "../HomePage";
import RecordPage from "../RecordPage";
import EditPage from "../EditPage";
import AboutPage from "../AboutPage";

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
