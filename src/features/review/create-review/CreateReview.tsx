import { useMutation, useQuery } from "@tanstack/react-query";
import { DatePicker, Input, Spin } from "antd";
import React, { useState } from "react";
import FormComponent from "../../../components/form-component/FormComponent";
import PageHeader from "../../../components/page-header/PageHeader";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../utils/getResponseMessage";

type Props = {};

const CreateReview = (props: Props) => {
  const createReviewForm = [
    {
      name: "giong",
      label: "Chi phí giống lúa",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí giống lúa"></Input>,
    },
    {
      name: "phanbon",
      label: "Chi phí phân bón",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí phân bón"></Input>,
    },
    {
      name: "xangdau",
      label: "Chi phí xăng dầu",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí xăng dầu"></Input>,
    },
    {
      name: "vattukhac",
      label: "Chi phí vật tư khác",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí vật tư khác"></Input>,
    },
    {
      name: "lamdat",
      label: "Chi phí làm đất",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí làm đất"></Input>,
    },
    {
      name: "gieosa",
      label: "Chi phí gieo xạ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí gieo xạ"></Input>,
    },
    {
      name: "lamco",
      label: "Chi phí làm cỏ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí làm cỏ"></Input>,
    },
    {
      name: "bomtuoi",
      label: "Chi phí bơm tưới",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí bơm tưới"></Input>,
    },
    {
      name: "thuhoach",
      label: "Chi phí thu hoạch",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí thu hoạch"></Input>,
    },
    {
      name: "rahat",
      label: "Chi phí rạ hạt",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí rạ hạt"></Input>,
    },
    {
      name: "phoisay",
      label: "Chi phí phơi sấy",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí phơi sấy"></Input>,
    },
    {
      name: "vanchuyen",
      label: "Chi phí vận chuyển",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí vận chuyển"></Input>,
    },
    {
      name: "thuyloiphi",
      label: "Chi phí thủy lợi",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Chi phí thủy lợi"></Input>,
    },
    {
      name: "tongsanluong",
      label: "Tổng sản lượng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tổng sản lượng"></Input>,
    },
    {
      name: "giaban",
      label: "Giá bán",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Giá bán"></Input>,
    },
    {
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input hidden placeholder="Giá bán"></Input>,
    },
    {
      name: "kiennghi",
      label: "Kiến nghị",
      formChildren: (
        <Input.TextArea rows={4} placeholder="Kiến nghị"></Input.TextArea>
      ),
    },
  ];

  let result: any = {};

  const handleFormSubmit = (values: any) => {
    console.log(values);

    // mutation_update_htx.mutate(formData, {
    //   onSuccess: (res) => {
    //     getResponseMessage(res);
    //   },
    //   onError: (err) => {
    //     getErrorMessage(err);
    //   },
    // });
  };

  // const mutation_update_htx = useMutation((data: any) => htxApi.update(data));

  let formComponentProps: any = {
    loading: false,
    onSubmit: handleFormSubmit,
    name: "create-review",
    buttonSubmit: "Cập nhật",
    data: createReviewForm,
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
      name: `review`,
      path: "/update",
    },
  ];

  return (
    <Spin spinning={false} style={{ height: "100vh" }}>
      <PageHeader
        allowSave
        edit={true}
        headerBreadcrumb={headerBreadcrumb}
        form="create-review"
        loading={false}
      ></PageHeader>
      <div className="profile">
        <FormComponent {...formComponentProps}></FormComponent>
      </div>
    </Spin>
  );
};

export default CreateReview;
