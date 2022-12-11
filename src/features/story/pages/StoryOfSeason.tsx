import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./story-of-season.scss";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
} from "antd";
import { DataSourceItemType } from "antd/lib/auto-complete";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import storyApi from "../../../api/storyApi";
import FormComponent from "../../../components/form-component/FormComponent";
import { formatMoment } from "../../../utils/formatMoment";
import { getResponseMessage } from "../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import landApi from "../../../api/land";
import { ColumnsType } from "antd/lib/table";
import { convertToMoment } from "../../../utils/convertToMoment";
import AutoComplete from "../../../components/auto-complete/AutoComplete";

type Props = {};

const StoryOfSeason = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [changeStatusLoading, setChangeStatusLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [searchForm] = Form.useForm();
  const [showModalReason, setShowModalReason] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [detailStory, setDetailStory] = useState<any>();
  const [type, setType] = useState<any>("create");
  const [categoryOfActivity, setCategoryOfActivity] = useState<any>(
    detailStory?.vattusudung || []
  );
  const [detailStoryId, setDetailStoryId] = useState<
    number | string | undefined
  >();
  const [loadingDetailStory, setLoadingDetailStory] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<any>();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    setCategoryOfActivity(detailStory?.vattusudung || []);
  }, [detailStoryId]);

  const fetchListLand = () => {
    return landApi.getAll({});
  };

  const land = useQuery(["activity/land"], fetchListLand);
  const actdivityForm = [
    {
      name: "name_hoatdong",
      label: "Tên hoạt động",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tên hoạt động"></Input>,
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
      name: "id_thuadat",
      label: "Thửa đất",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Select placeholder="Thửa đất">
          {land &&
            land?.data?.data.map((item: any) => {
              return (
                <Select.Option key={item.id_thuadat} value={item.id_thuadat}>
                  {item.address}
                </Select.Option>
              );
            })}
        </Select>
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
    {
      name: "description",
      label: "Mô tả",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input.TextArea placeholder="Mô tả"></Input.TextArea>,
    },
  ];

  useEffect(() => {
    (() => {
      navigate(
        `/htx/manage-story/detail/${id}?${queryString.stringify(filter)}`
      );
    })();
  }, [filter, id]);

  const handleUpdateStory = async (id: string | number | undefined) => {
    setLoadingDetailStory(true);
    setType("edit");

    try {
      setDetailStoryId(id);
      setIsModalOpen(true);
      const res = await storyApi.getDetail(id);
      setCategoryOfActivity(res?.data?.vattusudung || []);

      let data = res?.data;
      if (res && res.data) {
        const date = [
          {
            key: "date_start",
            value: data.date_start,
          },
          {
            key: "date_end",
            value: data.date_end,
          },
        ];

        if (convertToMoment(date)) {
          data = {
            ...data,
            ...convertToMoment(date),
          };
        }
      }
      setDetailStory(data || {});
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoadingDetailStory(false);
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id_nhatkydongruong",
    },
    {
      title: "ID thửa đất",
      dataIndex: "id_thuadat",
    },
    {
      title: "Tên hoạt động",
      dataIndex: "name_hoatdong",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "date_start",
    },
    {
      width: "20%",
      title: "Ngày kết thúc",
      dataIndex: "date_end",
    },
    {
      title: "Htx xác nhận",
      dataIndex: "hoptacxa_xacnhan",
      render: (_, record) => (
        <span>
          {record?.hoptacxa_xacnhan == 0
            ? "Chưa xác nhận"
            : record?.hoptacxa_xacnhan == 1 || record?.hoptacxa_xacnhan === null
            ? "Đã xác nhận"
            : "Đã bị hủy"}
        </span>
      ),
    },
    {
      title: (
        <div>
          <span>Thao tác</span>
          {/* <Checkbox
            style={{ marginLeft: "16px" }}
            onChange={(e) => handleCheckAllActivity(e)}
          ></Checkbox> */}
        </div>
      ),
      dataIndex: "status",
      render: (_: any, record: any) => {
        return (
          <div>
            <Popconfirm
              placement="topRight"
              title={"Bạn có chắc chắn đổi trạng thái"}
              onConfirm={() =>
                handleChangeStatus(record?.id_nhatkydongruong || "", null)
              }
              okText="Yes"
              cancelText="No"
            >
              <Checkbox
                style={{ marginLeft: "16px" }}
                disabled={
                  record?.type !== "inside" &&
                  !Boolean(record?.hoptacxa_xacnhan)
                }
                defaultChecked={record?.status || false}
                checked={record?.status || false}
                // onChange={(e) =>
                //   handleChangeStatus(record?.id_nhatkydongruong || "", e)
                // }
              ></Checkbox>
            </Popconfirm>

            <span
              className=""
              onClick={() => {
                handleUpdateStory(record?.id_nhatkydongruong);
              }}
              style={{
                display: "inline-block",
                marginLeft: "16px",
                cursor: "pointer",
              }}
            >
              <EditOutlined />
            </span>
            <span>
              {record.type !== "inside" && (
                <span
                  style={{ cursor: "pointer", marginLeft: "16px" }}
                  className=""
                >
                  <Popconfirm
                    placement="top"
                    title="Xóa hoạt động?"
                    onConfirm={() =>
                      handleConfirmDeleteActivityOfSeason(
                        record?.id_nhatkydongruong || ""
                      )
                    }
                  >
                    <DeleteOutlined />
                  </Popconfirm>
                </span>
              )}
            </span>
          </div>
        );
      },
    },
  ];

  const handleCheckAllActivity = (e: any) => {
    console.log(e);
  };

  const handleConfirmDeleteActivityOfSeason = async (id: string | number) => {
    try {
      const res = await storyApi.delete(id);
      getResponseMessage(res);
      refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const categoryForm = [
    {
      autoComplete: (
        <AutoComplete
          getName={true}
          returnName
          keyword=""
          type="vattusudung"
          Key="id_giaodichmuaban_vattu"
          Value="name_category_vattu"
          name="id_giaodichmuaban_vattu"
          lable="Vật tư"
        ></AutoComplete>
      ),
    },
    {
      name: "soluong",
      label: "Số lượng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <InputNumber
          placeholder="Số lượng"
          style={{ width: "100%" }}
        ></InputNumber>
      ),
    },
    {
      name: "timeuse",
      label: "Thời gian sử dụng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker placeholder="Thời gian sử dụng" style={{ width: "100%" }} />
      ),
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
    setType("create");

    setIsCreate(true);
    setDetailStoryId(undefined);
    setDetailStory({});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const fetchActivityOfSeasonList = (filter: any) => {
    return storyApi.getAll(id as string, filter);
  };

  const { isLoading, isError, data, error, isFetching, refetch } = useQuery(
    ["storyOfSeason/list", filter],
    () => fetchActivityOfSeasonList(filter),
    { cacheTime: 0 }
  ) as any;

  const mutation_add_activity = useMutation((data: any) =>
    storyApi.createActivity(data)
  );

  const mutation_update_activity = useMutation((data: any) =>
    storyApi.update(data, detailStoryId || "")
  );

  const handleChangeStatus = async (id: any, e: any) => {
    setChangeStatusLoading(true);

    try {
      const res = await storyApi.updateStatus(id);
      getResponseMessage(res);
      refetch();
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setChangeStatusLoading(false);
    }
  };

  const handleFormSubmit = (values: any) => {
    values.id_lichmuavu = id || "";
    values.date_start = formatMoment(values.date_start);
    values.date_end = formatMoment(values.date_end);
    values.vattusudung =
      categoryOfActivity.map((item: any) => {
        return {
          ...item,
          id_giaodichmuaban_vattu:
            item?.id_vattusudung ||
            JSON.parse(item?.id_giaodichmuaban_vattu)?.key ||
            "",
        };
      }) || [];

    if (detailStoryId) {
      mutation_update_activity.mutate(values, {
        onSuccess: (res) => {
          getResponseMessage(res);
          setIsModalOpen(false);
          refetch();
        },
        onError: (err) => getErrorMessage(err),
      });
    } else {
      mutation_add_activity.mutate(values, {
        onSuccess: (res) => {
          getResponseMessage(res);
          setIsModalOpen(false);
          refetch();
        },
        onError: (err) => getErrorMessage(err),
      });
    }
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

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleAddField = () => {
    setIsModalOpenCategory(true);
  };

  const handleCancelCategory = () => {
    setIsModalOpenCategory(false);
  };

  const handleFormSubmitCategory = (values: any) => {
    values.timeuse = values.timeuse.format("YYYY-MM-DD");
    setCategoryOfActivity((pre: any) => {
      const item = categoryOfActivity.find(
        (item: any) =>
          item?.id_giaodichmuaban_vattu == values.id_giaodichmuaban_vattu
      );
      if (item) {
        item.soluong += values.soluong;
        return [...pre];
      } else {
        return [...pre, values];
      }
    });

    setIsModalOpenCategory(false);
  };

  const handleDeleteCategory = (data: any) => {
    setCategoryOfActivity((pre: any) => {
      return pre?.filter((c: any) => c?.id_giaodichmuaban_vattu !== data);
    });
  };

  return (
    <div className="season-of-story">
      <div>
        <Button onClick={showModal}>Thêm hoạt động</Button>
      </div>
      <br />
      <h3>Danh sách hoạt động</h3>
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
                placeholder="Tìm kiếm hoạt động"
              ></Input>
              <Button form="search-activity" type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <div>
        <Table
          pagination={false}
          loading={isLoading || changeStatusLoading}
          columns={columns}
          dataSource={data?.data}
          rowClassName={(record) =>
            record.type !== "inside" && !Boolean(record?.hoptacxa_xacnhan)
              ? "disabled-row"
              : record?.hoptacxa_xacnhan == "2"
              ? "error-col"
              : ""
          }
        />
      </div>
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

      <Modal
        centered
        onCancel={handleCancel}
        title={
          detailStory && Object.keys(detailStory).length > 0
            ? "Chỉnh sửa hoạt động"
            : "Tạo hoạt động"
        }
        open={isModalOpen}
        width="70%"
        bodyStyle={{
          overflowY: "auto",
          maxHeight: "500px",
          position: "relative",
        }}
      >
        <Spin spinning={loadingDetailStory || (isLoading && !isCreate)}>
          <FormComponent
            type={type}
            isCreate={isCreate}
            initialValues={detailStory}
            updateId={detailStoryId}
            loading={
              mutation_add_activity.isLoading ||
              mutation_update_activity.isLoading ||
              false
            }
            onSubmit={handleFormSubmit}
            name="activityOfSeason"
            buttonSubmit="Thêm hoạt động"
            addField={true}
            onAddField={handleAddField}
            data={actdivityForm}
            categoryOfActivity={categoryOfActivity}
            onDeleteCategory={handleDeleteCategory}
          ></FormComponent>
        </Spin>
      </Modal>
      <Modal
        onCancel={handleCancelCategory}
        title={
          detailStory && Object.keys(detailStory).length > 0
            ? "Chỉnh sửa vật tư"
            : "Thêm vật tư"
        }
        open={isModalOpenCategory}
        width="50%"
        centered
      >
        <Spin spinning={false}>
          <FormComponent
            loading={false}
            onSubmit={handleFormSubmitCategory}
            name="categoryOfStory"
            buttonSubmit="Thêm vật tư"
            data={categoryForm}
          ></FormComponent>
        </Spin>
      </Modal>
    </div>
  );
};

export default StoryOfSeason;
