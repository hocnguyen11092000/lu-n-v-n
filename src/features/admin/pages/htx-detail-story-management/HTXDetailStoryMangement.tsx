import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, DatePicker, Input, Modal, Row, Select, Spin } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import htxApi from "../../../../api/htx";
import storyApi from "../../../../api/storyApi";
import FormComponent from "../../../../components/form-component/FormComponent";
import { convertToMoment } from "../../../../utils/convertToMoment";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";

type Props = {};

const HTXDetailStoryManagement = (props: Props) => {
  const { id } = useParams();
  const [showReason, setShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState("");

  const detailStoryManagement = [
    {
      name: "id_nhatkydongruong",
      label: "ID",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="ID"></Input>,
    },
    {
      name: "id_thuadat",
      label: "Thửa đất",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Thửa đất"></Input>,
    },
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
      name: "fullname",
      label: "Tên xã viên",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tên xã viên"></Input>,
    },
    {
      name: "address",
      label: "Địa chỉ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input.TextArea placeholder="Địa chỉ"></Input.TextArea>,
    },
    {
      name: "name_lichmuavu",
      label: "Mùa vụ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Mùa vụ"></Input>,
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
    {
      name: "date_start",
      label: "Ngày bắt đầu",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker
          disabled
          placeholder="Ngày bắt đầu"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      name: "date_end",
      label: "Ngày kết thúc",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker
          disabled
          placeholder="Ngày kết thúc"
          style={{ width: "100%" }}
        />
      ),
    },
    {
      name: "status",
      label: "Trạng thái",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Trạng thái"></Input>,
    },
    {
      name: "type",
      label: "Loại",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Loại"></Input>,
    },
    {
      name: "hoptacxa_xacnhan",
      label: "Hợp tác xã xác nhận",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Hợp tác xã xác nhận"></Input>,
    },
    {
      name: "reason",
      label: "Lý do từ chối",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input.TextArea rows={4} placeholder="Lý do từ chối"></Input.TextArea>
      ),
    },
  ];

  const fetchStoryOfUser = () => {
    return storyApi.getDetail(id || "");
  };

  let result: any = {};

  const detailStoryOfUser: any = useQuery(
    [`htx/detail-story-of-user/${id}`],
    fetchStoryOfUser
  );
  if (detailStoryOfUser?.data) {
    result = detailStoryOfUser?.data?.data;

    const date = [
      {
        key: "date_start",
        value: result?.date_start,
      },
      {
        key: "date_end",
        value: result?.date_end,
      },
    ];

    if (convertToMoment(date)) {
      result = {
        ...result,
        ...convertToMoment(date),
        status:
          result?.status == 0
            ? "Chưa được duyệt"
            : result?.status == "1"
            ? "Đã duyệt"
            : "Từ chối",

        hoptacxa_xacnhan:
          result?.hoptacxa_xacnhan == 0
            ? "Chưa được duyệt"
            : result?.hoptacxa_xacnhan == "1"
            ? "Đã duyệt"
            : "Từ chối",
      };
    }
  }

  const handleFormSubmit = (values: any) => {
    console.log(values);

    // mutatationUpdateProfile.mutate(values, {
    //   onSuccess: (res) => {
    //     getResponseMessage(res);
    //   },
    //   onError: (err) => {
    //     getErrorMessage(err);
    //   },
    // });
  };

  // const mutatationUpdateProfile = useMutation((data) =>
  //   commontApi.updateProfile(name, data)
  // );

  let formComponentProps: any = {
    loading: false,
    onSubmit: handleFormSubmit,
    name: "htx/detail-story-management/detail",
    buttonSubmit: "Cập nhật",
    data: detailStoryManagement,
    hideBtnSubmit: true,
    disableForm: true,
  };

  if (Object.keys(result).length > 0) {
    formComponentProps = {
      ...formComponentProps,
      initialValues: result,
    };
  }
  const handleConfirm = (value: any) => {
    if (value != 2) {
      mutation_update_confirm.mutate(
        { id: id, hoptacxa_xacnhan: value },
        {
          onSuccess: (res) => {
            getResponseMessage(res);
            // storyOfUser.refetch();
          },
          onError: (err) => {
            getErrorMessage(err);
          },
        }
      );
    } else {
      setShowReason(true);
    }
  };

  const mutation_update_confirm = useMutation((data: any) =>
    htxApi.htxConfirm(id || "", data)
  );

  const handleSave = () => {
    mutation_update_confirm.mutate(
      { id: id, hoptacxa_xacnhan: 2, reason: reasonValue },
      {
        onSuccess: (res) => {
          getResponseMessage(res);
          // storyOfUser.refetch();
          setShowReason(false);
          detailStoryOfUser.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  return (
    <Spin
      spinning={
        detailStoryOfUser.isLoading || mutation_update_confirm.isLoading
      }
      style={{ height: "100vh" }}
    >
      <div className="profile">
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
        <h3>Chi tiết nhật ký</h3>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Spin spinning={detailStoryOfUser.isLoading}>
            {detailStoryOfUser?.data?.data && (
              <Select
                onChange={(value: number | string) => handleConfirm(value)}
                size="small"
                value={
                  detailStoryOfUser?.data?.data?.hoptacxa_xacnhan + "" || ""
                }
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
            )}
          </Spin>
        </div>
        <br />
        {result?.vattusudung && result?.vattusudung.length > 0 && (
          <>
            <div className="category-of-activity">
              <h3>Vật tư sử dụng: </h3>
              <div style={{ margin: "4px 0" }}>
                {result?.vattusudung.map((item: any) => {
                  return (
                    <Row gutter={[16, 16]} style={{ marginBottom: "4px" }}>
                      <Col lg={10} md={10} sm={24} xs={24}>
                        <span>
                          <span className="m-r-4"> Tên vật tư: </span>
                          <b>
                            {" "}
                            {item?.name_category_vattu
                              ? item.name_category_vattu
                              : JSON.parse(item?.id_giaodichmuaban_vattu)
                                  ?.value || ""}
                          </b>
                        </span>
                      </Col>
                      <Col lg={6} md={6} sm={24} xs={24}>
                        <span>
                          <span className="m-r-4"> Số lượng:</span>
                          <b> {item?.soluong || ""}</b>
                        </span>
                      </Col>
                      <Col lg={8} md={8} sm={24} xs={24}>
                        <span>
                          <span className="m-r-4"> Thời gia sử dụng:</span>
                          <b> {item?.timeuse || ""}</b>
                        </span>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          </>
        )}
        <br />
        {Object.keys(result).length > 0 && (
          <FormComponent {...formComponentProps}></FormComponent>
        )}
      </div>
    </Spin>
  );
};

export default HTXDetailStoryManagement;
