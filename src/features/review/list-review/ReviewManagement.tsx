import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Pagination, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import reviewApi from "../../../api/review";

type Props = {
  baseUrl?: string;
  role?: string;
};

const ReviewManagement = ({ baseUrl, role }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  // useEffect(() => {
  //   (() => {
  //     navigate(
  //       `/${baseUrl || "shop"}/shop-management?${queryString.stringify(filter)}`
  //     );
  //   })();
  // }, [filter]);

  const fetchReview = (filter: any) => reviewApi.getAll({});

  const review: any = useQuery(["review-management", filter], () =>
    fetchReview(filter)
  );

  const tableColumns: any = [
    {
      title: "ID",
      dataIndex: "id_danhgiacuoimua",
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
    },
    {
      title: "Mùa vụ",
      dataIndex: "name_lichmuavu",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "date_end",
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
                `/${baseUrl || "shop"}/review-management/detail/${
                  record?.id_danhgiacuoimua || ""
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
              title="Xóa đánh giá?"
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
      <Button>
        <Link to="/htx/review-management/create">Tạo đánh giá</Link>
      </Button>
      <h3 style={{ margin: "16px 0" }}>Danh sách đánh giá cuối mùa</h3>
      <Table
        loading={review.isLoading}
        columns={tableColumns}
        dataSource={review?.data?.data || []}
        pagination={false}
      />
      <div className="pagiantion">
        {review?.data?.meta?.total > 0 && (
          <Pagination
            defaultCurrent={filter?.page as number}
            total={review?.data?.meta?.total}
            pageSize={filter?.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewManagement;
