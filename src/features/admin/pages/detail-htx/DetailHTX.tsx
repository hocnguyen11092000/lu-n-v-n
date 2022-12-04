import { useMutation, useQuery } from "@tanstack/react-query";
import { DatePicker, Input, Spin } from "antd";
import React, { useState } from "react";
import htxApi from "../../../../api/htx";
import FormComponent from "../../../../components/form-component/FormComponent";
import PageHeader from "../../../../components/page-header/PageHeader";
import UploadImag from "../../../../components/upload-image/UploadImage";
import { convertToMoment } from "../../../../utils/convertToMoment";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";

type Props = {};

const DetailHTX = (props: Props) => {
  const [file, setFile] = useState(null);

  const fetchDetailHTX = () => {
    return htxApi.getDetail();
  };

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  const detailHTX: any = useQuery(["htx/detail"], fetchDetailHTX);
  const detailHTXForm = [
    {
      name: "id_hoptacxa",
      label: "ID",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Họ tên"></Input>,
    },
    {
      name: "name_hoptacxa",
      label: "Tên hợp tác xã",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tên hợp tác xã"></Input>,
    },
    {
      name: "email",
      label: "Email",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Email"></Input>,
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
      name: "created_at",
      label: "Ngày tạo",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <DatePicker disabled placeholder="Ngày tạo" style={{ width: "100%" }} />
      ),
    },
    {
      name: "chunhiem_name",
      label: "Tên chủ nhiệm",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Tên chủ nhiệm"></Input>,
    },
    {
      name: "chunhiem_phone_number",
      label: "Số điện thoại chủ nhiệm",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Số điện thoại chủ nhiệm"></Input>
      ),
    },
    {
      name: "chunhiem_email",
      label: "Email chủ nhiệm",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Email chủ nhiệm"></Input>,
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
    {
      name: "description",
      label: "Mô tả",
      formChildren: (
        <Input.TextArea rows={4} placeholder="Mô tả"></Input.TextArea>
      ),
    },
    {
      name: "thumbnail",
      label: "",
      formChildren: (
        <UploadImag
          image={detailHTX?.data?.data?.thumbnail}
          onChange={handleChangeImage}
        ></UploadImag>
      ),
    },
  ];

  let result: any = {};

  if (detailHTX?.data) {
    result = detailHTX?.data?.data;

    const date = [
      {
        key: "created_at",
        value: result?.created_at,
      },
    ];

    if (convertToMoment(date)) {
      result = {
        ...result,
        ...convertToMoment(date),
      };
    }
  }

  const handleFormSubmit = (values: any) => {
    values.thumbnail = file || null;

    const formData: any = new FormData();
    file && formData.append("thumbnail", file || null);
    formData.append("phone_number", values.phone_number);
    formData.append("name_hoptacxa", values.name_hoptacxa);
    formData.append("email", values.email);
    formData.append("address", values.address);
    formData.append("description", values.description);

    mutation_update_htx.mutate(formData, {
      onSuccess: (res) => {
        getResponseMessage(res);
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_update_htx = useMutation((data: any) => htxApi.update(data));

  let formComponentProps: any = {
    loading: mutation_update_htx.isLoading,
    onSubmit: handleFormSubmit,
    name: "update-post",
    buttonSubmit: "Cập nhật",
    data: detailHTXForm,
    hideBtnSubmit: true,
    setData: false,
  };

  if (Object.keys(result).length > 0) {
    formComponentProps = {
      ...formComponentProps,
      initialValues: result,
    };
  }

  const headerBreadcrumb = [
    {
      name: "Hợp tác xã",
      path: "/htx",
    },
    {
      name: `Cập nhật `,
      path: "/update",
    },
  ];

  return (
    <Spin spinning={detailHTX.isLoading} style={{ height: "100vh" }}>
      <PageHeader
        allowSave
        edit={true}
        headerBreadcrumb={headerBreadcrumb}
        form="update-post"
        loading={mutation_update_htx.isLoading}
      ></PageHeader>
      <div className="profile">
        <h3>Chi tiết hợp tác xã</h3>
        {Object.keys(result).length > 0 && (
          <FormComponent {...formComponentProps}></FormComponent>
        )}
      </div>
    </Spin>
  );
};

export default DetailHTX;
