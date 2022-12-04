import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router";
import { Navigate, Routes } from "react-router-dom";
import AllPageLoading from "../components/loading/AllPageLoading";
import NotFound from "../components/not-found/NotFound";
import PreviewContract from "../components/preview/PreviewContract";
import Profile from "../components/profile/Profile";
import { PATH } from "../enum";
import CreateHTX from "../features/admin/pages/create-htx/CreateHTX";
import HomeAdmin from "../features/admin/pages/home-admin/HomeAdmin";
import Login from "../features/auth/login/pages/login/Login";
import Register from "../features/auth/register/pages/regsiter/Register";
import HomePage from "../features/home/pages";
import HomeTraders from "../features/traders/components/home/HomeTraders";
import Pusher from "pusher-js";
import { useCallback, useEffect, useMemo } from "react";
import { addNotification } from "../redux/notificationSlice";
import UserDetail from "../components/user-detail/UserDetail";
import { notification } from "antd";
import { NotificationPlacement } from "antd/lib/notification";
import HomeShop from "../features/shop/components/home/HomeShop";
import moment from "moment";

type Props = {};

const RootRouter = (props: Props) => {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    moment.locale("fr");
  }, []);

  useEffect(() => {
    var pusher = new Pusher("a4b9a95d179cda3450fe", {
      cluster: "ap1",
    });

    var channel = pusher.subscribe(`notification.${user?.id_user || ""}`);

    channel.bind("notification", async function (data: any) {
      if (data?.modelsNotification) {
        notification.info({
          message: `Thông báo`,
          description: data?.modelsNotification.message,
          placement: "bottomRight",
          duration: 5,
        });

        await dispatch(addNotification(data?.modelsNotification));
      }
    });
  }, []);

  return (
    <AllPageLoading>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Navigate to="/g"></Navigate>}></Route>
        <Route path={PATH.LOGIN} element={<Login></Login>}></Route>
        <Route path={PATH.REGISTER} element={<Register></Register>}></Route>
        <Route
          path={"/user-detail"}
          element={<UserDetail></UserDetail>}
        ></Route>
        <Route path={`${PATH.HTX}/*`} element={<HomeAdmin></HomeAdmin>}></Route>
        <Route
          path={PATH.PREVIEW}
          element={<PreviewContract></PreviewContract>}
        ></Route>
        <Route
          path={`${PATH.TRADER}/*`}
          element={<HomeTraders></HomeTraders>}
        ></Route>
        <Route path="/g/*" element={<HomePage></HomePage>}></Route>
        <Route path={`shop/*`} element={<HomeShop></HomeShop>}></Route>
      </Routes>
    </AllPageLoading>
  );
};

export default RootRouter;
