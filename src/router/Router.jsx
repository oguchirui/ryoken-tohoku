import { useRoutes } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import RecordPage from "@/pages/record/RecordPage";
import EditPage from "@/pages/edit/EditPage";
import AboutPage from "@/pages/about/AboutPage";

const Router = () => {
  // ルートパスに対応するコンポーネントを設定
  const routingConfig = [
    {
      path: "/",
      element: <HomePage />, // トップページ
    },
    {
      path: "/home",
      element: <HomePage />, // /homeもトップページにする場合
    },
    {
      path: "/record",
      element: <RecordPage />, // 活動記録ページ
    },
    {
      path: "/edit",
      element: <EditPage />, // 編集ページ
    },
    {
      path: "/about",
      element: <AboutPage />, // サイトについてページ
    },
  ];

  // useRoutesで設定したルーティング情報をもとにレンダリング
  const routing = useRoutes(routingConfig);

  return routing;
};

export default Router;
