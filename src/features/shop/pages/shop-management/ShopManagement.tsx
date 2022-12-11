import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import materialsApi from "../../../../api/materials";
import queryString from "query-string";

type Props = {
  baseUrl?: string;
  role?: string;
};

const ShopManagement = ({ baseUrl, role }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    (() => {
      navigate(
        `/${baseUrl || "shop"}/shop-management?${queryString.stringify(filter)}`
      );
    })();
  }, [filter]);
  console.log(role);

  const fetchMaterials = (filter: any) =>
    role == "chunhiem"
      ? materialsApi.getAllChairman(filter)
      : materialsApi.getAll(filter);

  const materials: any = useQuery(["materials", filter], () =>
    fetchMaterials(filter)
  );

  const tableColumns: any = [
    {
      title: "ID",
      width: "5%",
      dataIndex: "id_giaodich_luagiong",
    },
    {
      title: "Mùa vụ",
      width: "15%",
      dataIndex: "name_lichmuavu",
    },
    {
      title: "Giống lúa",
      dataIndex: "name_gionglua",
    },
    {
      title: "Xã viên",
      dataIndex: "name_xavien",
    },
    {
      title: "Tên người bán",
      dataIndex: "name_daily",
    },
    {
      title: "Số lượng",
      dataIndex: "soluong",
    },
    {
      title: "Trạng thái",
      width: "10%",
      dataIndex: "status",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.status == 0 ? (
              <span className="not-success">chưa hoàn thành</span>
            ) : (
              <span className="success">hoàn thành</span>
            )}
          </span>
        );
      },
    },
    {
      title: "Htx xác nhận",
      width: "8%",
      dataIndex: "hoptacxa_xacnhan",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.hoptacxa_xacnhan == 0 ? (
              <span className="not-confirm">chưa xác nhận</span>
            ) : record?.hoptacxa_xacnhan == 2 ? (
              <span className="refuse">Đã hủy</span>
            ) : (
              <span className="confirm">xác nhận</span>
            )}
          </span>
        );
      },
    },
    {
      title: "Ncc xác nhận",
      width: "8%",
      dataIndex: "nhacungcap_xacnhan",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.nhacungcap_xacnhan == 0 ? (
              <span className="not-confirm">chưa xác nhận</span>
            ) : (
              <span className="confirm">xác nhận</span>
            )}
          </span>
        );
      },
    },
    {
      title: "Xã viên xác nhận",
      dataIndex: "xavien_xacnhan",
      width: "8%",
      render: (text: any, record: any) => {
        return (
          <span>
            {record?.xavien_xacnhan == 0 ? (
              <span className="not-confirm">chưa xác nhận</span>
            ) : (
              <span className="confirm">xác nhận</span>
            )}
          </span>
        );
      },
    },
    {
      fixed: "right",
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            className=""
            onClick={() =>
              navigate(
                `/${baseUrl || "shop"}/shop-management/detail-contract/${
                  record?.id_giaodich_luagiong || ""
                }`
              )
            }
            style={{
              display: "inline-block",
              marginRight: "16px",
              cursor: "pointer",
            }}
          >
            <EditOutlined />
          </span>
          <span style={{ cursor: "pointer" }} className="">
            <Popconfirm
              placement="top"
              title="Xóa hợp đồng?"
              onConfirm={
                () => {}
                // handleConfirmDeleteCategory(record?.id_danhmucquydinh)
              }
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  return (
    <div className="shop-management">
      {role == "nhacungcap" && (
        <Button>
          <Link to="/shop/shop-management/create-shop">Tạo giao dịch</Link>
        </Button>
      )}

      <h3 style={{ margin: "16px 0" }}>
        Danh sách giao dịch mua bán lúa giống
      </h3>
      <Table
        scroll={{ x: 2000 }}
        loading={materials.isLoading}
        columns={tableColumns}
        dataSource={materials?.data?.data || []}
        pagination={false}
      />
      <div className="pagiantion">
        {materials?.data?.meta?.total > 0 && (
          <Pagination
            // defaultCurrent={filter?.page as number}
            current={Number(filter.page)}
            total={materials?.data?.meta?.total}
            pageSize={filter?.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>
    </div>
  );
};

export default ShopManagement;
