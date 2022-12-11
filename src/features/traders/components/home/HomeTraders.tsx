import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  BellOutlined,
  BugOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PayCircleOutlined,
  SnippetsOutlined,
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
import logo from "../../../../assets/images/admin-logo.jpg";
import Notification from "../../../../components/notification/Notification";
import Profile from "../../../../components/profile/Profile";
import { PATH } from "../../../../enum";
import { resetCount } from "../../../../redux/notificationSlice";
import { handleLogout } from "../../../../utils/logout";
import Dashboard from "../../../admin/pages/dashboard/Dashboard";
import CreatePost from "../../../post/pages/create-post/CreatePost";
import DetailPost from "../../../post/pages/detail-post/DetailPost";
import DetailRiceTransactionUser from "../../../rice-transaction/pages/detail-rice-transaction-user/DetailRiceTransactionUser";
import RiceTransactionManagement from "../../../rice-transaction/pages/RiceTransactionManagement";
import CreateCategoryPertocodes from "../../pages/category-pesticides-management/CategoryPertocodesManagement";
import CreateContract from "../../pages/create-contract/CreateContract";
import DetailContract from "../../pages/detail-contract/DetailContract";
import DetailCategory from "../../pages/detailCategory/DetailCategory";
import ContractManagement from "../contract/ContractManagement";
import PostManagement from "../../../post/pages/post-management/PostManagement";

const { Header, Sider, Content } = Layout;

const HomeTraders = () => {
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
      setCurrentPath("/trader/" + location.pathname.split("/")[2]);
    })();
  }, [location.pathname]);

  const createMenu = [
    {
      key: `${PATH.TRADER}${PATH.DASHBOARD}`,
      icon: <AppstoreAddOutlined />,
      label: (
        <Link to={`${PATH.TRADER}${PATH.DASHBOARD}`}>Bảng điều khiển</Link>
      ),
    },
    {
      key: `${PATH.TRADER}${PATH.CATEGORY_MANAGEMENT}`,
      icon: <BugOutlined />,
      label: (
        <Link to={`${PATH.TRADER}${PATH.CATEGORY_MANAGEMENT}`}>
          Danh mục qui định
        </Link>
      ),
    },
    {
      key: `${PATH.TRADER}${PATH.CONTRACT_MANAGEMENT}`,
      icon: <ContainerOutlined />,
      label: (
        <Link to={`${PATH.TRADER}${PATH.CONTRACT_MANAGEMENT}`}>
          Quản lý hợp đồng
        </Link>
      ),
    },
    {
      key: `${PATH.TRADER}${"/rice-transaction-management"}`,
      icon: <PayCircleOutlined />,
      label: (
        <Link to={`${PATH.TRADER}${"/rice-transaction-management"}`}>
          Giao dịch lúa
        </Link>
      ),
    },
    {
      key: `${"/trader"}${"/post-management"}`,
      icon: <SnippetsOutlined />,
      label: (
        <Link to={`${"/trader"}${"/post-management"}`}>Quản lý bài viết</Link>
      ),
    },
    // {
    //   key: `${PATH.TRADER}${PATH.SUPPLIER}`,
    //   icon: <FullscreenExitOutlined />,
    //   label: <Link to={`${PATH.TRADER}${PATH.SUPPLIER}`}>Quản lý vật tư</Link>,
    // },
  ];

  const menu: any = (
    <Menu
      items={[
        {
          key: PATH.PROFILE,
          label: (
            <span>
              <Link to={`${PATH.TRADER}${PATH.PROFILE}`}>
                Thông tin cá nhân
              </Link>
            </span>
          ),
        },
        {
          key: "trader-home",
          label: <div onClick={() => navigate("/")}>Về trang chủ</div>,
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
              <Link to={`${PATH.TRADER}${PATH.PROFILE}`}>
                <span
                  style={{
                    marginLeft: "12px",
                    fontSize: "11px",
                    color: "#333",
                  }}
                >
                  {!collapsed && "Thương lái"}
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
                className="notification center"
                style={{
                  cursor: "pointer",
                  marginRight: "20px",
                  marginLeft: "8px",
                }}
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
              {/* <div className="app ml-12 center">
                <AppstoreOutlined style={{ fontSize: "18px" }} />
              </div> */}
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
              element={<Dashboard url="thuonglai/dash-board"></Dashboard>}
            ></Route>
            <Route
              path={PATH.CATEGORY_MANAGEMENT}
              element={<CreateCategoryPertocodes></CreateCategoryPertocodes>}
            ></Route>
            <Route
              path={PATH.CONTRACT_MANAGEMENT}
              element={<ContractManagement></ContractManagement>}
            ></Route>
            <Route
              path={`${PATH.CONTRACT_MANAGEMENT}${PATH.CONTRACT_CREATE}`}
              element={<CreateContract></CreateContract>}
            ></Route>
            <Route
              path={`${PATH.CONTRACT_MANAGEMENT}${PATH.CONTRACT_DETAIL}`}
              element={<DetailContract></DetailContract>}
            ></Route>
            <Route
              path={`${PATH.CONTRACT_MANAGEMENT}${PATH.CONTRACT_DETAIL}`}
              element={<DetailContract></DetailContract>}
            ></Route>
            <Route
              path={`${PATH.CATEGORY_MANAGEMENT}${PATH.CATEGORY_DETAIL}`}
              element={<DetailCategory></DetailCategory>}
            ></Route>
            {/* <Route
              path={`${PATH.SUPPLIER}`}
              element={<Supplier></Supplier>}
            ></Route> */}
            <Route
              path={"/rice-transaction-management"}
              element={
                <RiceTransactionManagement
                  baseUrl="trader"
                  role="trader"
                ></RiceTransactionManagement>
              }
            ></Route>
            <Route
              path={"/rice-transaction-management/detail/:id"}
              element={<DetailRiceTransactionUser></DetailRiceTransactionUser>}
            ></Route>
            <Route
              path={PATH.PROFILE}
              element={<Profile name="thuonglai"></Profile>}
            ></Route>
            <Route
              path={"/post-management"}
              element={<PostManagement baseUrl="trader"></PostManagement>}
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

export default HomeTraders;
