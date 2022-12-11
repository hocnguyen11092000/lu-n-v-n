import {
  ApiOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  BellOutlined,
  BugOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SnippetsOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Badge, Dropdown, Layout, Menu, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Notification from "../../../../components/notification/Notification";
import Profile from "../../../../components/profile/Profile";
import { PATH } from "../../../../enum";
import PostManagement from "../../../post/pages/post-management/PostManagement";
import { resetCount } from "../../../../redux/notificationSlice";
import { handleLogout } from "../../../../utils/logout";
import Dashboard from "../../../admin/pages/dashboard/Dashboard";
import CreatePost from "../../../post/pages/create-post/CreatePost";
import DetailPost from "../../../post/pages/detail-post/DetailPost";
import CreateContractSupplier from "../../pages/create-contract-supplier/CreateContractSupplier";
import CreateShop from "../../pages/create-shop-rice/CreateShop";
import DetailShopContract from "../../pages/detail-shop-contract/DetailShopContract";
import DetailSupplierContract from "../../pages/detail-supplier-contract/DetailSupplierContract";
import ShopManagement from "../../pages/shop-management/ShopManagement";
import SupplierManagement from "../../pages/supplier-management/SupplierManagement";

const { Header, Sider, Content } = Layout;

const HomeShop = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  const location = useLocation();
  const notification = useSelector((state: any) => state.notification);
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const layout: any = document.querySelector(".ant-layout-content");

    if (layout) {
      const PageHeader = document.querySelector(".page-header");

      if (!PageHeader) {
        layout.classList.remove("m-t-63");
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    (() => {
      setCurrentPath("/shop/" + location.pathname.split("/")[2]);
    })();
  }, [location.pathname]);

  const createMenu = [
    {
      key: `${"/shop"}${PATH.DASHBOARD}`,
      icon: <AppstoreAddOutlined />,
      label: <Link to={`${"/shop"}${PATH.DASHBOARD}`}>Bảng điều khiển</Link>,
    },
    {
      key: `${"/shop"}${"/shop-management"}`,
      icon: <TransactionOutlined />,
      label: (
        <Link to={`${"/shop"}${"/shop-management"}`}>Giao dịch lúa giống</Link>
      ),
    },
    {
      key: `${"/shop"}${"/supplier-management"}`,
      icon: <ApiOutlined />,
      label: (
        <Link to={`${"/shop"}${"/supplier-management"}`}>Giao dịch vật tư</Link>
      ),
    },
    {
      key: `${"/shop"}${"/post-management"}`,
      icon: <SnippetsOutlined />,
      label: (
        <Link to={`${"/shop"}${"/post-management"}`}>Quản lý bài viết</Link>
      ),
    },
  ];

  const menu: any = (
    <Menu
      items={[
        {
          key: PATH.PROFILE,
          label: (
            <span>
              <Link to={`${"/shop"}${PATH.PROFILE}`}>Thông tin cá nhân</Link>
            </span>
          ),
        },
        {
          key: "logout",
          label: <div onClick={() => handleLogout(navigate)}>Đăng xuất</div>,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="side-bar"
      >
        <div className="logo">
          <Link to={`${"/shop"}${"/dashboard"}`}>
            <img
              src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
              alt=""
            />
          </Link>
          {
            <div>
              <Link to={`${PATH.HTX}${"/manage-htx/detail"}`}>
                <span
                  style={{
                    marginLeft: "12px",
                    fontSize: "11px",
                    color: "#333",
                  }}
                >
                  {!collapsed && "Nhà cung cấp"}
                </span>
                <div
                  style={
                    !collapsed
                      ? {
                          display: "block",
                        }
                      : { display: "none" }
                  }
                  className="logo-title opacity"
                >
                  {user?.user?.fullname || ""}
                </div>
              </Link>
            </div>
          }
        </div>
        {currentPath && (
          <Menu
            mode="inline"
            defaultSelectedKeys={[currentPath]}
            items={createMenu}
          />
        )}
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
          }}
          className="header-admin"
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="user-info">
            <Space align="center">
              <Dropdown overlay={menu} arrow trigger={["click"]}>
                <span>
                  <span className="user-info__name">
                    {user?.user?.fullname || ""}
                  </span>
                  <img
                    src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                    alt=""
                  />
                </span>
              </Dropdown>
              <div
                onClick={() => dispatch(resetCount())}
                className="notification ml-16 center"
                style={{ cursor: "pointer" }}
              >
                <Dropdown
                  overlay={<Notification></Notification>}
                  placement="bottomRight"
                  trigger={["click"]}
                  arrow
                >
                  <Badge count={notification?.count || 0} showZero={false}>
                    <span className="icon-notification">
                      <BellOutlined style={{ fontSize: "18px" }} />
                    </span>
                  </Badge>
                </Dropdown>
              </div>
              <div className="app ml-12 center">
                <AppstoreOutlined style={{ fontSize: "18px" }} />
              </div>
            </Space>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route
              path={PATH.DASHBOARD}
              element={<Dashboard url="nhacungcapvattu/dash-board"></Dashboard>}
            ></Route>
            <Route
              path={"/shop-management"}
              element={<ShopManagement role="nhacungcap"></ShopManagement>}
            ></Route>
            <Route
              path={"/shop-management/create-shop"}
              element={<CreateShop></CreateShop>}
            ></Route>
            <Route
              path={"/shop-management/detail-contract/:id"}
              element={<DetailShopContract></DetailShopContract>}
            ></Route>
            <Route
              path={"/supplier-management"}
              element={
                <SupplierManagement role="nhacungcap"></SupplierManagement>
              }
            ></Route>
            <Route
              path={"/supplier-management/create-contract-supplier"}
              element={<CreateContractSupplier></CreateContractSupplier>}
            ></Route>
            <Route
              path={"/supplier-management/detail-supplier-contract/:id"}
              element={<DetailSupplierContract></DetailSupplierContract>}
            ></Route>
            <Route
              path={"/post-management"}
              element={<PostManagement baseUrl="shop"></PostManagement>}
            ></Route>
            <Route
              path={"/post-management/create"}
              element={<CreatePost></CreatePost>}
            ></Route>
            <Route
              path={"/post-management/detail/:id"}
              element={<DetailPost></DetailPost>}
            ></Route>
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeShop;
