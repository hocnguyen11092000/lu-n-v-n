import { width } from "@mui/system";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Col, DatePicker, Input, Row, Skeleton, Space, Spin } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi";
import { storeUser } from "../../redux/userSlice";
import { convertToMoment } from "../../utils/convertToMoment";
import { formatMoment } from "../../utils/formatMoment";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { getResponseMessage } from "../../utils/getResponseMessage";
import FormComponent from "../form-component/FormComponent";
import UploadImage from "../upload-image/UploadImage";
import "./user-detail.scss";

type Props = {};

const UserDetail = (props: Props) => {
  const [file, setFile] = useState();
  const fetchUserDetail = () => userApi.getDetail();

  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  let userDetail: any = useQuery(["user-detail-dashboard"], fetchUserDetail, {
    cacheTime: 0,
  });
  let result = {};

  if (userDetail?.data?.data) {
    const date = [
      {
        key: "dob",
        value: userDetail?.data?.data.dob,
      },
    ];

    if (convertToMoment(date)) {
      result = {
        ...userDetail?.data?.data,
        ...convertToMoment(date),
      };
    }
  }

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  const userDetailForm = [
    {
      name: "fullname",
      label: "Họ tên",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Họ tên"></Input>,
    },
    {
      name: "email",
      label: "Email",
      rules: [
        {
          required: true,
        },
        {
          type: "email",
        },
      ],
      formChildren: <Input placeholder="Email"></Input>,
    },
    {
      name: "dob",
      label: "Ngày sinh",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker placeholder="Ngày sinh" style={{ width: "100%" }} />
      ),
    },
    {
      name: "phone_number",
      label: "Số điện thoại",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Số điện thoại"></Input>,
    },
    {
      name: "avatar",
      label: "",
      formChildren: (
        <UploadImage
          image={userDetail?.data?.data.avatar || null}
          onChange={handleChangeImage}
        ></UploadImage>
      ),
    },
    {
      name: "address",
      label: "Địa chỉ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input.TextArea rows={4} placeholder="Địa chỉ"></Input.TextArea>
      ),
    },
  ];

  const handleFormSubmit = (values: any) => {
    values.avatar = file || null;
    values.dob = formatMoment(values.dob);

    const formData: any = new FormData();
    formData.append("fullname", values.fullname);
    formData.append("email", values.email);
    formData.append("dob", values.dob);
    formData.append("address", values.address);
    formData.append("avatar", values.avatar);

    mutation_update_user.mutate(formData, {
      onSuccess: (res) => {
        getResponseMessage(res);

        dispatch(storeUser({ ...user, user: { ...user.user, ...res.data } }));
        // localStorage.setItem(
        //   "user_luanvan",
        //   JSON.stringify({
        //     ...user,
        //     user: { ...user.user, ...res.data },
        //   })
        // );
        userDetail.refetch();
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_update_user = useMutation((data) => userApi.updateUser(data));

  let formComponentProps: any = {
    loading: mutation_update_user.isLoading,
    onSubmit: handleFormSubmit,
    name: "season",
    buttonSubmit: "Cập nhật",
    data: userDetailForm,
    hideBtnSubmit: false,
    goBackUrl: "/",
    showBack: true,
    setData: false,
  };

  if (result && Object.keys(result).length > 0) {
    formComponentProps = {
      ...formComponentProps,
      initialValues: result,
    };
  }

  return (
    <div className="detail-user-wrapper">
      {" "}
      {userDetail.isLoading ? (
        <div
          style={{
            margin: "50px",
            padding: "20px",
            boxShadow: "0 7px 25px rgba(0 0 0 /8%)",
            borderRadius: "8px",
          }}
        >
          <Row gutter={[30, 30]}>
            <Col sm={24} xs={24} lg={24} md={24}>
              <Skeleton.Input
                size="small"
                active
                style={{
                  width: 850,
                  borderRadius: "6px",
                  marginBottom: "16px",
                }}
              />
            </Col>
            <br />
            <Col sm={24} xs={24} lg={12} md={12}>
              <Skeleton.Input
                active
                style={{ width: 550, borderRadius: "6px" }}
              />
            </Col>
            <Col sm={24} xs={24} lg={12} md={12}>
              <Skeleton.Input
                active
                style={{ width: 550, borderRadius: "6px" }}
              />
            </Col>
            <Col sm={24} xs={24} lg={12} md={12}>
              <Skeleton.Input
                active
                style={{ width: 550, borderRadius: "6px" }}
              />
            </Col>
            <Col sm={24} xs={24} lg={12} md={12}>
              <Skeleton.Input
                active
                style={{ width: 550, borderRadius: "6px" }}
              />
            </Col>
            <Col sm={24} xs={24} lg={12} md={12}>
              <Skeleton.Input
                active
                style={{ width: 550, borderRadius: "6px" }}
              />
            </Col>
            <Col sm={24} xs={24} lg={12} md={12}>
              <Skeleton.Input
                active
                style={{ width: 550, borderRadius: "6px" }}
              />
            </Col>
            <Col sm={24} xs={24} lg={12} md={12}>
              <Space>
                <Skeleton.Button
                  active={true}
                  shape="default"
                  style={{ width: "150px" }}
                />
                <Skeleton.Button
                  active={true}
                  shape="default"
                  style={{ width: "150px" }}
                />
              </Space>
            </Col>
          </Row>
        </div>
      ) : (
        <Spin spinning={false}>
          <div className="detail-user">
            <h3>Chỉnh sửa thông tin cá nhân</h3>
            {Object.keys(result).length > 0 && (
              <FormComponent {...formComponentProps}></FormComponent>
            )}
          </div>
        </Spin>
      )}
    </div>
  );
};

export default UserDetail;
