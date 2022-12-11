import { Breadcrumb, Button, Select } from "antd";
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./page-header.scss";
type Props = {
  form: string;
  loading?: boolean;
  disabled?: boolean;
  headerBreadcrumb?: any;
  edit?: boolean;
  isConfirm?: boolean;
  confirmLoading?: boolean;
  onConfirm?: () => void;
  toggleConfirm?: boolean;
  allowApprove?: boolean;
  onApprove?: (val: any) => void;
  isAllowApprove?: boolean;
  disableApprove?: boolean;
  disabledSelect?: boolean;
  allowSave?: boolean;
};

const PageHeader = ({
  form,
  loading = false,
  disabled = false,
  headerBreadcrumb,
  edit,
  isConfirm = false,
  confirmLoading = false,
  onConfirm,
  toggleConfirm,
  allowApprove,
  onApprove,
  isAllowApprove,
  disableApprove,
  disabledSelect,
  allowSave,
}: Props) => {
  const navigate = useNavigate();
  const headerRef = useRef<any>();
  const location = useLocation();

  useEffect(() => {
    if (headerRef.current) {
      const layout: any = document.querySelector(".ant-layout-content");

      if (layout) {
        console.log("run");
        console.log(layout.classList);

        layout.classList.add("m-t-63");
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        headerRef.current?.classList.add("active");
      } else {
        headerRef.current?.classList.remove("active");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="page-header" ref={headerRef}>
      <div className="breadcrumb">
        {headerBreadcrumb && headerBreadcrumb.length > 0 && (
          <Breadcrumb>
            {headerBreadcrumb.map((item: any) => {
              return (
                <Breadcrumb.Item key={item.name}>{item.name}</Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        )}
      </div>
      <div className="page-header-btn">
        <Button loading={loading} onClick={() => navigate(-2)}>
          Trở lại
        </Button>
        {edit !== false && (
          <Button
            disabled={
              allowSave ? false : disabled || disableApprove || !isConfirm
            }
            loading={loading}
            form={form}
            htmlType="submit"
            type="primary"
          >
            Lưu
          </Button>
        )}
        {isConfirm && !allowApprove && (
          <Button
            disabled={disableApprove}
            onClick={() => onConfirm && onConfirm()}
            loading={confirmLoading}
            type="primary"
          >
            {!toggleConfirm ? "Xác nhận giao dịch" : "Hủy xác nhận giao dịch"}
          </Button>
        )}

        {isAllowApprove && (
          // <Button
          //   onClick={() => onApprove && onApprove()}
          //   loading={false}
          //   type="primary"
          // >
          //   {toggleConfirm ? "Duyệt" : "Từ chối"}
          // </Button>

          <Select
            disabled={disableApprove || disabledSelect}
            onChange={(val: any) => onApprove && onApprove(val)}
            value={allowApprove}
            style={{ width: "150px", marginLeft: "4px" }}
          >
            <Select.Option value={0}>Chờ duyệt</Select.Option>
            <Select.Option value={1}>Duyệt</Select.Option>
            <Select.Option value={2}>Hủy</Select.Option>
          </Select>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
