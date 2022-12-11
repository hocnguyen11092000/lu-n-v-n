import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import materialsApi from "../../../../api/materials";
import queryString from "query-string";
import supplierContractApi from "../../../../api/supplierContract";
import supplierCategoryContractApi from "../../../../api/supplierCategoryContract";

type Props = {
  baseUrl?: string;
  role?: string;
};

const SupplierManagement = ({ baseUrl, role }: Props) => {
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
        `/${baseUrl || "shop"}/supplier-management?${queryString.stringify(
          filter
        )}`
      );
    })();
  }, [filter]);

  const fetchSupplierContract = (filter: any) =>
    role == "chunhiem"
      ? supplierCategoryContractApi.getAllChairman(filter)
      : supplierCategoryContractApi.getAll(filter);

  const suplierContract: any = useQuery(
    ["supplier/contract/list", filter],
    () => fetchSupplierContract(filter)
  );

  const tableColumns: any = [
    {
      title: "ID",
      width: "5%",
      dataIndex: "id_giaodichmuaban_vattu",
    },
    {
      title: "Mùa vụ",
      width: "12%",
      dataIndex: "name_lichmuavu",
    },
    {
      title: "Tên vật tư",
      width: "10%",
      dataIndex: "name_category_vattu",
    },
    {
      title: "Xã viên",
      width: "10%",
      dataIndex: "name_xavien",
    },
    {
      title: "Tên người bán",
      width: "10%",
      dataIndex: "name_daily",
    },
    {
      title: "Số lượng",
      dataIndex: "soluong",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "10%",
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
      width: "8%",
      dataIndex: "xavien_xacnhan",
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
                `/${
                  baseUrl || "shop"
                }/supplier-management/detail-supplier-contract/${
                  record?.id_giaodichmuaban_vattu || ""
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
          <Link to="/shop/supplier-management/create-contract-supplier">
            Tạo hợp đồng
          </Link>
        </Button>
      )}

      <h3 style={{ margin: "16px 0" }}>Danh sách giao dịch mua bán vật tư</h3>
      <Table
        scroll={{ x: 2000 }}
        loading={suplierContract.isLoading}
        columns={tableColumns}
        dataSource={suplierContract?.data?.data || []}
        pagination={false}
      />
      <div className="pagiantion">
        {suplierContract?.data?.meta?.total > 0 && (
          <Pagination
            // defaultCurrent={filter?.page as number}
            current={Number(filter.page)}
            total={suplierContract?.data?.meta?.total}
            pageSize={filter?.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>
    </div>
  );
};

export default SupplierManagement;
