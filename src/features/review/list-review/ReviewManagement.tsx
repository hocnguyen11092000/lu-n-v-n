import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import reviewApi from "../../../api/review";
import { getResponseMessage } from "../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import AutoComplete from "../../../components/auto-complete/AutoComplete";

type Props = {
  baseUrl?: string;
  role?: string;
};

const ReviewManagement = ({ baseUrl, role }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formSearchReview] = Form.useForm();
  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
    id_lichmuavu: null,
  });

  useEffect(() => {
    (() => {
      navigate(
        `/${baseUrl || "htx"}/review-management?${queryString.stringify(
          filter
        )}`
      );
    })();
  }, [filter]);

  const fetchReview = (filter: any) => reviewApi.getAll({});

  const review: any = useQuery(["review-management", filter], () =>
    fetchReview(filter)
  );

  const handleConfirmDeleteReview = async (id: any) => {
    try {
      const res = await reviewApi.delete(id);
      getResponseMessage(res);
      review.refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };

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
              onConfirm={() =>
                handleConfirmDeleteReview(record?.id_danhgiacuoimua)
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

  const handleSearchReview = (value: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        search: value?.search?.trim() || "",
      };
    });
  };

  const handleSelectSeason = (val: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        id_lichmuavu: val || "",
      };
    });
  };

  return (
    <div className="shop-management">
      <Button>
        <Link to="/htx/review-management/create">Tạo đánh giá</Link>
      </Button>
      <h3 style={{ margin: "16px 0" }}>Danh sách đánh giá cuối mùa</h3>
      <Row
        style={{ marginBottom: "8px" }}
        gutter={{ xs: 8, sm: 8, md: 16, lg: 16 }}
        justify={"end"}
      >
        <Col lg={6} md={6} sm={24} xs={24}>
          <AutoComplete
            width="100%"
            onSelect={handleSelectSeason}
            placeholder="lịch mùa vụ"
            Key="id_lichmuavu"
            Value="name_lichmuavu"
            type="lichmuavu"
            lable="lịch mùa vụ"
          ></AutoComplete>
        </Col>
      </Row>
      <Table
        loading={review.isLoading}
        columns={tableColumns}
        dataSource={review?.data?.data || []}
        pagination={false}
      />
      <div className="pagiantion">
        {review?.data?.meta?.total > 0 && (
          <Pagination
            // defaultCurrent={filter?.page as number}
            current={Number(filter.page)}
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
