import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import htxApi from "../../../../api/htx";
import AutoComplete from "../../../../components/auto-complete/AutoComplete";
import { convertToMoment } from "../../../../utils/convertToMoment";
import { formatMoment } from "../../../../utils/formatMoment";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { validateMessage } from "../../../../utils/validateMessage";
import queryString from "query-string";
import "./htx-story-management.scss";

type Props = {};

const HTXStorymanagement = (props: Props) => {
  const [showReason, setShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
      title: "Ngày kết thúc",
      dataIndex: "date_end",
    },
    {
      title: "Htx xác nhận",
      dataIndex: "hoptacxa_xacnhan",
      render: (_, record) => (
        <span>
          {record?.status == 0
            ? "Chưa xác nhận"
            : record?.status == 1
            ? "Đã xác nhận"
            : "Đã bị hủy"}
        </span>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: "20%",
    },
    {
      width: "15%",
      title: "Hành động",
      fixed: "right",
      dataIndex: "",
      key: "x",
      render: (text, record: any) => (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              className=""
              onClick={() => {
                navigate(
                  "/htx/story-of-user/detail/" + record?.id_nhatkydongruong
                );
              }}
              style={{
                display: "inline-block",
                marginRight: "16px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              <EditOutlined />
            </span>
            <Select
              onChange={(value: number | string) =>
                handleConfirm(value, record?.id_nhatkydongruong || "")
              }
              size="small"
              value={record?.hoptacxa_xacnhan + "" || ""}
              placeholder="Trạng thái"
              style={{ width: 150 }}
              options={[
                {
                  value: "0",
                  label: "Chưa xác nhận",
                },
                {
                  value: "1",
                  label: "Xác nhận",
                },
                {
                  value: "2",
                  label: "Hủy",
                },
              ]}
            />
          </div>
        </>
      ),
    },
  ];

  const handleConfirm = (value: any, id: string) => {
    if (value != 2) {
      mutation_update_confirm.mutate(
        { id: id, hoptacxa_xacnhan: value },
        {
          onSuccess: (res) => {
            getResponseMessage(res);
            storyOfUser.refetch();
          },
          onError: (err) => {
            getErrorMessage(err);
          },
        }
      );
    } else {
      setShowReason(true);
      setDeleteId(id);
    }
  };

  const handleSubmitReason = () => {};

  const mutation_update_confirm = useMutation((data: any) =>
    htxApi.htxConfirm(data?.id || "", data)
  );

  const [filter, setFilter] = useState<any>({
    hoptacxa_xacnhan: 0,
    type: "outside",
    id_lichmuavu: null,
    date_start: null,
    date_end: null,
  });

  useEffect(() => {
    navigate(`/htx/story-of-user?${queryString.stringify(filter)}`);
  }, [filter]);

  const [tabList, setTabList] = useState([
    {
      key: "0",
      name: "Đang chờ xác nhận",
      active: true,
      hoptacxa_xacnhan: 0,
      type: "outside",
    },
    {
      key: "1",
      name: "Đã xác nhận",
      active: false,
      hoptacxa_xacnhan: 1,
      type: "outside",
    },
    {
      key: "2",
      name: "Đã bị hủy",
      active: false,
      hoptacxa_xacnhan: 2,
      type: "outside",
    },
  ]);

  const fetchStoryOfUser = (filter: any) => htxApi.storyOfUser(filter);
  const storyOfUser = useQuery(["story-of-user", filter], () =>
    fetchStoryOfUser(filter)
  );

  const handleChangeTab = (key: string | number) => {
    if (tabList && tabList.length > 0) {
      tabList.forEach((item: any) => {
        item.active = false;
      });

      const currentItem = tabList.find((item: any) => item.key === key);
      if (currentItem) {
        console.log(currentItem);

        currentItem.active = true;
        setTabList([...tabList]);

        setFilter((pre: any) => {
          return {
            ...pre,
            hoptacxa_xacnhan: currentItem.hoptacxa_xacnhan,
            type: currentItem.type,
          };
        });
      }
    }
  };

  const handleSave = () => {
    mutation_update_confirm.mutate(
      { id: deleteId, hoptacxa_xacnhan: 2, reason: reasonValue },
      {
        onSuccess: (res) => {
          getResponseMessage(res);
          storyOfUser.refetch();
          setShowReason(false);
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  // const handleSelectSeason = (id_lichmuavu: any) => {
  //   if (id_lichmuavu) {
  //     setFilter((pre) => {
  //       return {
  //         ...pre,
  //         id_lichmuavu: id_lichmuavu,
  //       };
  //     });
  //   }
  // };

  const onSubmit = (values: any) => {
    setFilter((pre: any) => {
      return {
        ...pre,
        id_lichmuavu: values.id_lichmuavu,
        date_start: values.date_start ? formatMoment(values.date_start) : null,
        date_end: values.date_end ? formatMoment(values.date_end) : null,
      };
    });
  };

  return (
    <div className="story-of-user">
      <Modal
        title="Lý do từ chối"
        open={showReason}
        onCancel={() => setShowReason(false)}
      >
        <Input
          placeholder="Lý do từ chối"
          onChange={(e) => setReasonValue(e.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSave();
            }
          }}
        />
        <br />
        <Button
          loading={mutation_update_confirm.isLoading}
          type="primary"
          onClick={handleSave}
        >
          Lưu
        </Button>
      </Modal>
      <h3>Nhập ký đồng ruộng</h3>

      {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <AutoComplete
          width={"25%"}
          onSelect={handleSelectSeason}
          placeholder="lịch mùa vụ"
          Key="id_lichmuavu"
          Value="name_lichmuavu"
          type="lichmuavu"
        ></AutoComplete>
      </div> */}

      <Form
        validateMessages={validateMessage()}
        form={form}
        layout="vertical"
        name="filer-season-activity"
        onFinish={onSubmit}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
          <Col lg={14} md={14} sm={24} xs={24}>
            <Row gutter={{ xs: 8, sm: 8, md: 16, lg: 16 }}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item name="date_start" label="Ngày bắt đầu">
                  <DatePicker
                    placeholder="Ngày bắt đầu"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="date_end"
                  label="Ngày kết thúc"
                  hasFeedback
                  rules={[
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
          </Col>

          <Col lg={10} md={10} sm={24} xs={24}>
            <Row gutter={{ xs: 8, sm: 8, md: 16, lg: 16 }}>
              <Col lg={16} md={16} sm={24} xs={24}>
                <AutoComplete
                  // onSelect={handleSelectSeason}
                  placeholder="lịch mùa vụ"
                  Key="id_lichmuavu"
                  Value="name_lichmuavu"
                  type="lichmuavu"
                  name="id_lichmuavu"
                  lable="lịch mùa vụ"
                ></AutoComplete>
              </Col>
              <Col lg={8} md={8} sm={24} xs={24}>
                <Button
                  type="primary"
                  style={{ marginTop: "20px" }}
                  htmlType="submit"
                >
                  Tìm kiếm
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      <ul className="tab-activity-user">
        {tabList &&
          tabList.map((item: any) => (
            <li
              onClick={() => handleChangeTab(item?.key || "")}
              className={item?.active ? "active" : ""}
              key={item?.key}
            >
              {item?.name || ""}
            </li>
          ))}
      </ul>
      <Table
        scroll={{ x: 1300 }}
        loading={
          storyOfUser.isLoading ||
          storyOfUser.isFetching ||
          mutation_update_confirm.isLoading
        }
        columns={columns}
        dataSource={storyOfUser?.data?.data || []}
        pagination={false}
      />
    </div>
  );
};

export default HTXStorymanagement;
