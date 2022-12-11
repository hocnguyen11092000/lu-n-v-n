import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import calendarApi from "../../api/calendar";

interface DataType {
  key: React.Key;
  name: string;
  type: string;
  start: string;
  end: string;
}

const Story = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });
  const [id_gionglua, setId_gionglua] = useState();
  const [searchForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    (() => {
      navigate(`/htx/manage-story?${queryString.stringify(filter)}`);
    })();
  }, [filter]);

  const htx = useSelector((state: any) => state.htx);

  const columns = useMemo(() => {
    const columns: ColumnsType<DataType> = [
      {
        title: "ID",
        dataIndex: "id_lichmuavu",
      },
      {
        title: "Tên lịch mùa vụ",
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
        title: "Trạng thái",
        dataIndex: "status",
        render: (text: any, record: any) => (
          <>
            <span>
              {record?.status == "start" ? (
                <span className="success">Đang diễn ra</span>
              ) : record?.status == "finish" ? (
                <span className="confirm">Đã kết thúc</span>
              ) : (
                <span className="not-confirm">Sắp bắt đầu</span>
              )}
            </span>
          </>
        ),
      },
      {
        title: "Hành động",
        dataIndex: "",
        key: "x",
        render: (text, record: any) => (
          <>
            <span
              className=""
              onClick={() => {
                navigate("/htx/manage-story/detail/" + record?.id_lichmuavu);
              }}
              style={{
                display: "inline-block",
                marginRight: "16px",
                cursor: "pointer",
              }}
            >
              <EditOutlined />
            </span>
          </>
        ),
      },
    ];

    return columns;
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchCalendarList = (filter: any) => {
    return calendarApi.getAll(filter);
  };

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    ["season/list", filter],
    () => fetchCalendarList(filter)
  ) as any;

  const handleSetDisableSeason = (value: boolean) => {
    console.log(value);
  };

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleSearchActivity = (value: { search: string }) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  return (
    <div className="season-management">
      <div className="list-user">
        <br />
        <h3>Danh sách lịch mùa vụ</h3>
        <br />
        <div style={{ textAlign: "right" }}>
          <Form
            form={searchForm}
            layout="vertical"
            name="search-activity"
            id="search-activity"
            onFinish={handleSearchActivity}
          >
            <Form.Item name="search">
              <Space>
                <Input
                  defaultValue={filter.search}
                  placeholder="Tìm kiếm lịch mùa vụ"
                ></Input>
                <Button form="search-activity" type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <Table
          pagination={false}
          loading={isLoading}
          columns={columns}
          dataSource={data?.data}
        />
        <div className="pagiantion">
          {data?.meta?.total > 0 && (
            <Pagination
              // defaultCurrent={filter.page as number}
              current={Number(filter.page)}
              total={data?.meta?.total}
              pageSize={filter.limit as number}
              onChange={handlePagination}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;
