import { useMutation, useQuery } from "@tanstack/react-query";
import { DatePicker, Input, Spin } from "antd";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import reviewApi from "../../../../api/review";
import FormComponent from "../../../../components/form-component/FormComponent";
import PageHeader from "../../../../components/page-header/PageHeader";
import { formatPrice } from "../../../../utils/formatPrice";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";

type Props = {
  baseUrl?: any;
};

const DetailReview = ({ baseUrl }: Props) => {
  const { id } = useParams();

  const fetchDetailReview = (id: any) => {
    return reviewApi.getDetail(id);
  };

  const deatailReview: any = useQuery(
    ["htx/review/detail", id],
    () => fetchDetailReview(id),
    { cacheTime: 0 }
  );

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
  if (deatailReview?.data?.data) {
    result = {
      ...deatailReview?.data?.data,
    };
    result.giong = formatPrice(deatailReview?.data?.data.giong || 0);
    result.phanbon = formatPrice(deatailReview?.data?.data.phanbon || 0);
    result.xangdau = formatPrice(deatailReview?.data?.data.xangdau || 0);
    result.vattukhac = formatPrice(deatailReview?.data?.data.vattukhac || 0);
    result.lamdat = formatPrice(deatailReview?.data?.data.lamdat || 0);
    result.lamco = formatPrice(deatailReview?.data?.data.lamco || 0);
    result.bomtuoi = formatPrice(deatailReview?.data?.data.bomtuoi || 0);
    result.thuhoach = formatPrice(deatailReview?.data?.data.thuhoach || 0);
    result.phoisay = formatPrice(deatailReview?.data?.data.phoisay || 0);
    result.rahat = formatPrice(deatailReview?.data?.data.rahat || 0);
    result.vanchuyen = formatPrice(deatailReview?.data?.data.vanchuyen || 0);
    result.thuyloiphi = formatPrice(deatailReview?.data?.data.thuyloiphi || 0);
    result.tongsanluong = formatPrice(
      deatailReview?.data?.data.tongsanluong || 0
    );
    result.giaban = formatPrice(deatailReview?.data?.data.giaban || 0);
  }

  const handleFormSubmit = (values: any) => {
    mutation_update_review.mutate(values, {
      onSuccess: (res) => {
        getResponseMessage(res);
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_update_review = useMutation((data: any) =>
    reviewApi.update(data, id)
  );

  let formComponentProps: any = {
    loading: mutation_update_review.isLoading,
    onSubmit: handleFormSubmit,
    name: "update-review",
    buttonSubmit: "Cập nhật",
    data: createReviewForm,
    hideBtnSubmit: true,
    setData: false,
  };

  if (
    deatailReview?.data?.data &&
    Object.keys(deatailReview?.data?.data).length > 0
  ) {
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
    <Spin spinning={deatailReview.isLoading} style={{ height: "100vh" }}>
      <PageHeader
        allowSave
        edit={true}
        headerBreadcrumb={headerBreadcrumb}
        form="update-review"
        loading={mutation_update_review.isLoading}
      ></PageHeader>
      <div className="profile">
        {deatailReview?.data?.data && (
          <FormComponent {...formComponentProps}></FormComponent>
        )}
      </div>
    </Spin>
  );
};

export default DetailReview;
