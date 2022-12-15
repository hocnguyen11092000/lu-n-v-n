import {
  CaretDownOutlined,
  DownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { Link } from "react-router-dom";
import "./list-menu.scss";
type Props = {};

const ListMenu = (props: Props) => {
  const menu = (
    <Menu
      items={[
        {
          label: <a target="_blank">Tin tức 1</a>,
          key: "0",
        },
        {
          label: <a target="_blank">Tin tức 2</a>,
          key: "1",
        },

        {
          label: "Tin tức 3",
          key: "3",
          disabled: false,
        },
      ]}
    />
  );

  const menu_LoHang = (
    <Menu
      items={[
        {
          label: <Link to="/g/htx">Hợp tác xã</Link>,
          key: "0",
        },
        {
          label: <Link to="/g/lohang">Lô hàng</Link>,
          key: "1",
        },
      ]}
    />
  );

  return (
    <div className="header-list-menu">
      <div className="header-list-menu__icon">
        <HomeOutlined />
      </div>
      <div className="header-list-menu__drop-down">
        <span className="header-list-menu__drop-down-item">
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()} style={{ color: "#fff" }}>
              <Space>
                Tin tức
                <CaretDownOutlined />
              </Space>
            </a>
          </Dropdown>
        </span>
        {/* <span className="header-list-menu__drop-down-item">
          <Dropdown overlay={menu}>
            <a onClick={(e) => e.preventDefault()} style={{ color: "#fff" }}>
              <Space size="small">
                Thời tiết và đất
                <CaretDownOutlined />
              </Space>
            </a>
          </Dropdown>
        </span> */}
        <span className="header-list-menu__drop-down-item">
          <Dropdown overlay={menu_LoHang}>
            <a onClick={(e) => e.preventDefault()} style={{ color: "#fff" }}>
              <Space size="small">
                Truy xuất
                <CaretDownOutlined />
              </Space>
            </a>
          </Dropdown>
        </span>
      </div>
    </div>
  );
};

export default ListMenu;
