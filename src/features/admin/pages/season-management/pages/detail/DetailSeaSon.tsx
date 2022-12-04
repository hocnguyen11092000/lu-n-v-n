import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./detail-season.scss";
import queryString from "query-string";
import { useSelector } from "react-redux";
import calendarApi from "../../../../../../api/calendar";
import { useMutation, useQuery } from "@tanstack/react-query";
import activityApi from "../../../../../../api/activity";
import { formatMoment } from "../../../../../../utils/formatMoment";
import { validateMessage } from "../../../../../../utils/validateMessage";
import { ColumnsType } from "antd/es/table";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AutoComplete from "../../../../../../components/auto-complete/AutoComplete";
import FormComponent from "../../../../../../components/form-component/FormComponent";
import { convertToMoment } from "../../../../../../utils/convertToMoment";
import { getErrorMessage } from "../../../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../../../utils/getResponseMessage";
import PageHeader from "../../../../../../components/page-header/PageHeader";
import ActionOfList from "../../../../../../components/action-of-list/ActionOfList";

type Props = {};

const DetailSeaSon = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [loadingDetailAct, setLoadingDetailAct] = useState(false);
  const [activityDetail, setActivityDetail] = useState();
  const [activityId, setActivityId] = useState<number>();
  const [disableBtnUpdateSeason, setDisableBtnUpdateSeason] = useState(false);
  const [columns, setColumns] = useState<any>([
    {
      title: "ID",
      dataIndex: "id_hoatdongmuavu",
    },
    {
      title: "Tên hoạt động",
      dataIndex: "name_hoatdong",
    },
    {
      title: "Môt tả hoạt động",
      dataIndex: "description_hoatdong",
      rowSpan: 4,
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
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            className=""
            onClick={() => handleEditActivity(record?.id_hoatdongmuavu)}
            style={{
              display: "inline-block",
              marginRight: "16px",
              cursor: "pointer",
            }}
          >
            <EditOutlined />
          </span>
          <span className="" style={{ cursor: "pointer" }}>
            <Popconfirm
              placement="top"
              title="Xóa hoạt động?"
              onConfirm={() => handleConfirmDeleteActivity(record)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        </>
      ),
    },
  ]);

  const defaultFilter = {
    page: 1,
    limit: 5,
    search: "",
  };

  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    (() => {
      navigate(
        `/htx/manage-season/detail/${id}?${queryString.stringify(filter)}`
      );
    })();
  }, [filter]);

  const htx = useSelector((state: any) => state.htx.role);

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
          returnName
          keyword="name_gionglua"
          type="gionglua"
          Key="id_gionglua"
          Value="name_gionglua"
          name="id_gionglua"
          lable="Giống lúa"
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

  const handleConfirmDeleteActivity = async (record: any) => {
    try {
      await activityApi.delete(record?.id_hoatdongmuavu || "");
      message.success("Xóa thành công");
      activity.refetch();
    } catch (error) {
      message.error("Xóa thất bại");
      console.log(error);
    }
  };

  const fetchSeasonDetail = () => {
    return calendarApi.getDetail(id);
  };

  let seaSonDetail: any = useQuery(["season/detail"], fetchSeasonDetail, {
    cacheTime: 0,
  });

  let seaSonDetailData = seaSonDetail.data?.data || {};

  if (seaSonDetail && seaSonDetail.data) {
    const date = [
      {
        key: "date_start",
        value: seaSonDetailData.date_start,
      },
      {
        key: "date_end",
        value: seaSonDetailData.date_end,
      },
    ];

    if (convertToMoment(date)) {
      seaSonDetailData = {
        ...seaSonDetailData,
        ...convertToMoment(date),
      };
    }
  }

  const fetchActivitySeason = (filter: any) => {
    return activityApi.getAll(id as string, {
      ...filter,
    });
  };

  const activity: any = useQuery(["season/activity", filter], () =>
    fetchActivitySeason(filter)
  );

  const showModal = () => {
    form.resetFields();
    setActivityDetail(undefined);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onSubmit = (values: any) => {
    values.id_hoptacxa = htx.id_hoptacxa || null;
    values.id_hoatdongmuavu = activityId || null;
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);
    values.id_lichmuavu = id || null;

    if (activityDetail && Object.keys(activityDetail).length > 0) {
      console.log(activityDetail, values.id_hoatdongmuavu);

      // values.id_lichmuavu = id || null; ??

      mutation_update_activity.mutate(values, {
        onSuccess: (val) => {
          getResponseMessage(val);
          setIsModalOpen(false);
          activity.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    } else {
      mutation_create_activity.mutate(values, {
        onSuccess: (val) => {
          getResponseMessage(val);
          setIsModalOpen(false);
          activity.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    }
  };

  const mutation_create_activity = useMutation((data: any) =>
    activityApi.create(data)
  );

  const mutation_update_activity = useMutation((data: any) =>
    activityApi.update(data, data?.id_hoatdongmuavu || "")
  );

  const handlePagination = (page: number) => {
    setCurrentPage(page);

    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleSearchActivity = (value: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  const mutation_calendar = useMutation((data: any) =>
    calendarApi.updateCalendar(data, data?.id_lichmuavu || "")
  );

  const handleFormSubmit = (values: any) => {
    console.log(id);
    console.log("run");

    values.id_hoptacxa = htx.role.id_hoptacxa;
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);
    values.id_lichmuavu = id;

    mutation_calendar.mutate(values, {
      onError: (err) => getErrorMessage(err),
      onSuccess: () => {
        message.success("Thay đổi lịch thành công");

        setIsModalOpen(false);
        seaSonDetail.refetch();
      },
    });
  };

  const handleDisableUpdateSeason = (value: boolean) => {
    setDisableBtnUpdateSeason(value);
  };

  let formComponentProps: any = {
    loading: mutation_calendar.isLoading,
    onSubmit: handleFormSubmit,
    name: "season",
    buttonSubmit: "Thêm lịch mùa vụ",
    data: seasonForm,
    hideBtnSubmit: true,
    onDisable: handleDisableUpdateSeason,
  };

  if (Object.keys(seaSonDetailData).length > 0) {
    formComponentProps = {
      ...formComponentProps,
      initialValues: seaSonDetailData,
    };
  }

  const handleEditActivity = async (id: number) => {
    setLoadingDetailAct(true);
    setIsModalOpen(true);
    setActivityId(id);

    try {
      const res = await activityApi.getDetail(id);
      if (Object.keys(res.data).length > 0) {
        const date = [
          {
            key: "date_start",
            value: res.data?.date_start,
          },
          {
            key: "date_end",
            value: res.data?.date_end,
          },
        ];

        if (convertToMoment(date)) {
          setActivityDetail({ ...res.data, ...convertToMoment(date) });
          form.setFieldsValue({ ...res.data, ...convertToMoment(date) });
        }
      }
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoadingDetailAct(false);
    }
  };

  const handleResetField = () => {
    setFilter(defaultFilter);
    setCurrentPage(1);

    activity.refetch();
    form2.resetFields();
  };

  const handleFilterCol = (data: any) => {
    setColumns(data);
  };

  const handleAppyActivity = () => {
    mutation_apply_activity.mutate(
      {
        id_lichmuavu: id || "",
      },
      {
        onSuccess: (res) => {
          getResponseMessage(res);
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  const mutation_apply_activity = useMutation((id: any) =>
    calendarApi.apply(id)
  );

  return (
    <div className="detail-season">
      <PageHeader
        allowSave={true}
        loading={mutation_calendar.isLoading}
        form="season"
        disabled={disableBtnUpdateSeason}
      ></PageHeader>
      <Row gutter={30}>
        <Col lg={12} md={12} sm={20} xs={20}>
          <Skeleton loading={seaSonDetail.isLoading} active>
            <p></p>
          </Skeleton>
        </Col>

        <Col lg={10} md={10} sm={20} xs={20}>
          <Skeleton loading={seaSonDetail.isLoading} active>
            <p></p>
          </Skeleton>
        </Col>
      </Row>

      {seaSonDetail.data && seaSonDetail.data.data && (
        <Row>
          <Col span={24}>
            {/* <Descriptions title="Chi tiết lịch mùa vụ">
              <Descriptions.Item label="Tên mùa vụ">
                {seaSonDetail.data?.data.name_lichmuavu}
              </Descriptions.Item>
              <Descriptions.Item label="Tên giống lúa">
                {seaSonDetail.data?.data.name_lichmuavu}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {seaSonDetail.data?.data.status}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày bắt đầu">
                {seaSonDetail.data?.data.date_start}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kết thúc">
                {seaSonDetail.data?.data.date_end}
              </Descriptions.Item>
            </Descriptions> */}
            <FormComponent {...formComponentProps}></FormComponent>
          </Col>
        </Row>
      )}

      {seaSonDetail.isLoading ? (
        <div className="activity-action">
          <Space
            style={{
              width: "100%",
              padding: "16px 16px 20px 0",
              justifyContent: "space-between",
            }}
          >
            <Skeleton.Button
              active={true}
              shape="default"
              style={{ width: "200px" }}
            />
          </Space>
        </div>
      ) : (
        <div className="activity-action">
          <Space
            align="center"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="btn btn-add-activity">
                <Button onClick={showModal} type="primary">
                  Thêm hoạt động
                </Button>
              </div>
              <div className="apply-activity">
                <Button
                  loading={mutation_apply_activity.isLoading}
                  type="primary"
                  onClick={handleAppyActivity}
                >
                  Áp lịch mùa vụ
                </Button>
              </div>
            </div>
            <div className="seach-activity">
              <Form
                form={form2}
                layout="vertical"
                name="search-activity"
                id="search-activity"
                onFinish={handleSearchActivity}
              >
                <Form.Item name="search">
                  <Space>
                    <Input
                      ref={inputRef}
                      defaultValue={filter.search}
                      placeholder="Tìm kiếm hoạt động"
                    ></Input>
                    <Button
                      form="search-activity"
                      type="primary"
                      htmlType="submit"
                    >
                      Tìm kiếm
                    </Button>

                    <Popover
                      placement="topLeft"
                      title={"Thao tác mở rộng"}
                      content={
                        <ActionOfList
                          onSetFilterCol={handleFilterCol}
                          columns={columns}
                          onRefetch={() => activity.refetch()}
                          onReset={handleResetField}
                        ></ActionOfList>
                      }
                      trigger="click"
                    >
                      <Button type="primary">
                        <PlusOutlined />
                      </Button>
                    </Popover>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Space>
        </div>
      )}

      <Table
        loading={activity.isLoading || activity.isFetching}
        columns={columns}
        dataSource={activity?.data?.data}
        pagination={false}
      />
      <div className="pagiantion">
        {activity?.data?.meta?.total > 0 && (
          <Pagination
            defaultCurrent={filter.page as number}
            total={activity?.data?.meta?.total}
            pageSize={filter.limit as number}
            onChange={handlePagination}
            current={currentPage}
          />
        )}
      </div>
      <Modal
        title="Tạo hoạt động mùa vụ"
        onOk={handleCancel}
        open={isModalOpen}
        onCancel={handleCancel}
        bodyStyle={{ height: "auto" }}
        width="70%"
      >
        <Spin spinning={loadingDetailAct}>
          <Form
            validateMessages={validateMessage()}
            form={form}
            layout="vertical"
            name="add activity season"
            onFinish={onSubmit}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="name_hoatdong"
                  label="Tên hoạt động"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Tên hoạt động" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name="description_hoatdong"
                  label="Mô tả hoạt đông"
                >
                  <Input.TextArea
                    placeholder="Mô tả hoạt động"
                    rows={4}
                  ></Input.TextArea>
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button
                    form="add activity season"
                    type="primary"
                    htmlType="submit"
                    className="btn"
                    loading={
                      mutation_create_activity.isLoading ||
                      mutation_update_activity.isLoading
                    }
                  >
                    {activityDetail ? "Sửa hoạt động" : "  Thêm hoạt động"}
                  </Button>
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
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
                <Form.Item
                  name="date_end"
                  label="Ngày kết thúc"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("date_start") <= value) {
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
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default DetailSeaSon;
