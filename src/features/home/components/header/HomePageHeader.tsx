import { Col, Row, Input, Avatar, Dropdown, Menu } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./home-page-header.scss";
import ListMenu from "../list-menu/ListMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { handleLogout } from "../../../../utils/logout";
import SearchResult from "../../../../components/search-result/SearchResult";
import postApi from "../../../../api/post";
type Props = {};

const HomePageHeader = (props: Props) => {
  const user = useSelector((state: any) => state.user?.user);
  const [searchValue, setSearchValue] = useState("");
  const [dataSearch, setDataSearch] = useState<any>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [show, setShow] = useState(false);
  // home-search
  useEffect(() => {
    document.addEventListener("click", (e: any) => {
      if (!(e?.target?.id == "home-search")) {
        setShow(false);
      } else {
        setShow(true);
      }
    });
  }, []);

  const timer = useRef<any>();

  useEffect(() => {
    (() => {
      setLoadingSearch(true);

      if (timer.current) {
        clearTimeout(timer.current);
        setLoadingSearch(false);
      }

      if (!searchValue) {
        setLoadingSearch(false);
        return;
      }

      try {
        setShow(true);
        setLoadingSearch(true);

        timer.current = setTimeout(async () => {
          const res = await postApi.getAll({ search: searchValue });
          setDataSearch(res?.data);
          setLoadingSearch(false);
        }, 300);
      } catch (error) {
        setLoadingSearch(false);
      } finally {
        //setLoadingSearch(false);
      }
    })();

    return () => clearTimeout(timer.current);
  }, [searchValue]);

  const navigate = useNavigate();

  let data = user?.account?.map((item: any) => {
    if (item) {
      return {
        ...item,
        label: (
          <div className="account-dropdown">
            <Link
              to={
                item?.name === "Xã Viên"
                  ? "/htx/dashboard"
                  : item?.name === "Thương Lái"
                  ? "/trader/dashboard"
                  : "/shop/dashboard"
              }
            >
              Vào trang quản lý {item?.name}
            </Link>
          </div>
        ),
        key: item?.id_account,
      };
    }
  });
  user &&
    data.push(
      {
        label: (
          <span
            onClick={() => navigate("/user-detail")}
            className="account-dropdown"
          >
            Thông tin cá nhân
          </span>
        ),
        key: "profile",
      },
      {
        label: (
          <span
            onClick={() => handleLogout(navigate)}
            className="account-dropdown"
          >
            Đăng xuất
          </span>
        ),
        key: "logout",
      }
    );
  const menu = <Menu items={data || []} />;

  return (
    <div className="home-header">
      <Row
        gutter={12}
        style={{
          padding: "12px 160px 8px 160px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Col lg={4} md={4} sm={4} xs={4}>
          <div className="home-header__logo">
            <Link to="/g" style={{ color: "#fff" }}>
              <span>Nông nghiệp xanh</span>
            </Link>
          </div>
        </Col>
        <Col lg={15} md={12} sm={0} xs={0}>
          <div
            className="home-header__search"
            style={{ textAlign: "right", position: "relative" }}
          >
            <Input
              id="home-search"
              // onFocus={() => setShow(true)}
              className="border-none"
              placeholder="Tìm kiếm thông tin"
              style={{ width: "85%" }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <SearchOutlined
              className="home-header__search-btn"
              style={{ cursor: "pointer" }}
            />
            {show && (
              <SearchResult
                loading={loadingSearch}
                show={show}
                data={dataSearch}
                searchWords={searchValue}
              ></SearchResult>
            )}
          </div>
        </Col>
        <Col lg={5} md={4} sm={4} xs={4}>
          <div className="home-header__auth">
            {user ? (
              <Dropdown overlay={menu} trigger={["click"]} arrow>
                <div
                  className="cursor-poiner text-small"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <img
                    style={{
                      width: "30px",
                      height: "30px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      marginRight: "8px",
                      padding: "4px",
                      border: "1px solid #fff",
                    }}
                    src={
                      user?.avatar ||
                      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                    }
                    alt=""
                  />
                  <a
                    style={{
                      color: "inherit",
                      maxWidth: "150px",
                      overflow: "hidden",
                      fontSize: "13px",
                      textOverflow: "ellipsis",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {user?.fullname}
                  </a>
                </div>
              </Dropdown>
            ) : (
              <>
                <span className="cursor-poiner text-small">
                  <Link to="/login" style={{ color: "inherit" }}>
                    Đăng nhập |
                  </Link>
                </span>

                <span className="cursor-poiner text-small">
                  <Link to="/register" style={{ color: "inherit" }}>
                    Đăng kí
                  </Link>
                </span>
              </>
            )}
          </div>
        </Col>
        <Row>
          <Col span={24}>
            <ListMenu></ListMenu>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default HomePageHeader;
