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
import calendarApi from "../../../../../../api/calendar";
import AutoComplete from "../../../../../../components/auto-complete/AutoComplete";
import FormComponent from "../../../../../../components/form-component/FormComponent";
import { formatMoment } from "../../../../../../utils/formatMoment";
import { validateMessage } from "../../../../../../utils/validateMessage";
import queryString from "query-string";
import { getResponseMessage } from "../../../../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../../../../utils/getErrorMessage";

interface DataType {
  key: React.Key;
  name: string;
  type: string;
  start: string;
  end: string;
}

const SeaSonManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
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
      navigate(`/htx/manage-season?${queryString.stringify(filter)}`);
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
                navigate("/htx/manage-season/detail/" + record?.id_lichmuavu);
              }}
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
                title="Xóa lịch mùa vụ?"
                onConfirm={() => handleConfirmDeleteSeason(record)}
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];

    return columns;
  }, []);

  const handleConfirmDeleteSeason = async (record: any) => {
    try {
      const res = await calendarApi.delete(record?.id_lichmuavu || "");
      getResponseMessage(res);
      refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const mutation_calendar = useMutation((data: any) =>
    calendarApi.createCalendar(data)
  );

  const handleFormSubmit = (values: any) => {
    values.id_hoptacxa = htx.role.id_hoptacxa;
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);

    mutation_calendar.mutate(values, {
      onError: (err) => {
        getErrorMessage(err);
      },
      onSuccess: (res) => {
        refetch();
        setIsModalOpen(false);
        getResponseMessage(res);
      },
    });
  };

  const fetchCalendarList = (filter: any) => {
    return calendarApi.getAll(filter);
  };

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    ["season/list", filter],
    () => fetchCalendarList(filter)
  ) as any;

  const seasonForm = [
    {
      name: "name_lichmuavu",
      label: "Tên mùa vụ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tên mùa vụ"></Input>,
    },
    {
      autoComplete: (
        <AutoComplete
          type="gionglua"
          Key="id_gionglua"
          Value="name_gionglua"
          name="id_gionglua"
          lable="Giống lúa"
          keyword="search"
        ></AutoComplete>
      ),
    },
    {
      name: "date_start",
      label: "Ngày bắt đầu",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker placeholder="Ngày bắt đầu" style={{ width: "100%" }} />
      ),
    },
    {
      name: "date_end",
      label: "Ngày kết thúc",
      rules: [
        {
          required: true,
        },
        ({ getFieldValue }: any): any => ({
          validator(_: any, value: any) {
            if (!value || getFieldValue("date_start") < value) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!")
            );
          },
        }),
      ],
      formChildren: (
        <DatePicker placeholder="Ngày kết thúc" style={{ width: "100%" }} />
      ),
    },
  ];

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
      <Button onClick={showModal}>Thêm Lịch mùa vụ</Button>

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
                  placeholder="Tìm kiếm mùa vụ"
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
              size="small"
              // defaultCurrent={filter.page as number}
              current={Number(filter.page)}
              total={data?.meta?.total}
              pageSize={filter.limit as number}
              onChange={handlePagination}
            />
          )}
        </div>
        <Modal
          title="Tạo mùa vụ"
          onOk={handleCancel}
          open={isModalOpen}
          onCancel={handleCancel}
          // bodyStyle={{ height: "300px" }}
          width="70%"
        >
          {/* <Form
            validateMessages={validateMessage()}
            form={form}
            layout="vertical"
            name="season"
            onFinish={onSubmit}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="name_lichmuavu"
                  label="Tên mùa vụ"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Tên mùa vụ" />
                </Form.Item>
                <Form.Item
                  name="date_start"
                  label="Ngày bắt đầu"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Ngày bắt đầu"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    loading={mutation_calendar.isLoading}
                    type="primary"
                    htmlType="submit"
                    className="btn"
                  >
                    Tạo lịch mùa vụ
                  </Button>
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <AutoComplete
                  Key="id_gionglua"
                  Value="name_gionglua"
                  name="id_gionglua"
                  lable="Giống lúa"
                ></AutoComplete>
                <Form.Item
                  name="date_end"
                  label="Ngày kết thúc"
                  rules={[
                    {
                      required: true,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("date_start") < value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Ngày kết thúc phải lớn hơn ngày bắt đầu!")
                        );
                      },
                    }),
                  ]}
                >
                  <DatePicker
                    placeholder="Ngày kết thúc"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form> */}
          <FormComponent
            onDisable={handleSetDisableSeason}
            loading={mutation_calendar.isLoading}
            onSubmit={handleFormSubmit}
            name="season"
            buttonSubmit="Thêm lịch mùa vụ"
            data={seasonForm}
          ></FormComponent>
        </Modal>
      </div>
    </div>
  );
};

export default SeaSonManagement;
