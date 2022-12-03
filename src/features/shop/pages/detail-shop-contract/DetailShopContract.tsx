import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button, Input, Modal, Spin } from "antd";
import React, { useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FormComponent from "../../../../components/form-component/FormComponent";
import shopContractApi from "../../../../api/shopContract";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageHeader from "../../../../components/page-header/PageHeader";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import UploadImag from "../../../../components/upload-image/UploadImage";

type Props = {
  baseUrl?: string;
};

const DetailShopContract = ({ baseUrl }: Props) => {
  const [ckData, setCkData] = useState();
  const [showReason, setShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [file, setFile] = useState(null);

  const { id } = useParams();

  const fetchDetailContract = (id: any) => {
    return shopContractApi.getDetail(id);
  };

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  const deatailContract: any = useQuery(
    ["shop/contract/detail", id],
    () => fetchDetailContract(id),
    { cacheTime: 0 }
  );

  const contractDetailForm = [
    {
      name: "id_giaodich_luagiong",
      label: "ID",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="ID"></Input>,
    },
    {
      name: "name_lichmuavu",
      label: "Lịch mùa vụ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Lịch mùa vụ"></Input>,
    },
    {
      name: "name_gionglua",
      label: "Giống lúa",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="giống lúa"></Input>,
    },
    {
      name: "soluong",
      label: "Số lượng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Số lượng"></Input>,
    },
    {
      name: "price",
      label: "Giá",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Giá"></Input>,
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
      name: "xavien_xacnhan",
      label: "Xã viên xác nhận",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Xã viên xác nhận"></Input>,
    },
    {
      name: "nhacungcap_xacnhan",
      label: "Nhà cung cấp xác nhận",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Nhà cung cấp xác nhận"></Input>
      ),
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
      editor: (
        <div>
          <p>Mô tả</p>
          <CKEditor
            config={{
              toolbar: [
                "selectAll",
                "undo",
                "redo",
                "bold",
                "italic",
                "blockQuote",
                "ckfinder",
                "imageTextAlternative",
                "imageUpload",
                "heading",
                "imageStyle:full",
                "imageStyle:side",
                "indent",
                "outdent",
                "link",
                "numberedList",
                "bulletedList",
                "mediaEmbed",
                "insertTable",
                "tableColumn",
                "tableRow",
                "mergeTableCells",
                "fontBackgroundColor",
                "fontColor",
              ],
              image: {
                // Configure the available styles.
                styles: ["alignLeft", "alignCenter", "alignRight"],
                sizes: ["50%", "75%", "100%"],

                // Configure the available image resize options.
                resizeOptions: [
                  {
                    name: "imageResize:original",
                    label: "Original",
                    value: null,
                  },
                  {
                    name: "imageResize:50",
                    label: "50%",
                    value: "50",
                  },
                  {
                    name: "imageResize:75",
                    label: "75%",
                    value: "75",
                  },
                ],

                // You need to configure the image toolbar, too, so it shows the new style
                // buttons as well as the resize buttons.
                toolbar: [
                  "imageStyle:alignLeft",
                  "imageStyle:alignCenter",
                  "imageStyle:alignRight",
                  "|",
                  "imageResize",
                  "|",
                  "imageTextAlternative",
                ],
              },
            }}
            editor={ClassicEditor}
            data={deatailContract?.data?.data?.description_giaodich}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              setCkData(data);
            }}
          />
          <br />
        </div>
      ),
    },
    {
      name: "name_xavien",
      label: "Tên xã viên",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Tên xã viên"></Input>,
    },

    {
      name: "xavien_phone_number",
      label: "Số điện xã viên",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Số điện thoại xã viên"></Input>
      ),
    },
    {
      name: "name_hoptacxa",
      label: "Tên hợp tác xã",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Tên hợp tác xã"></Input>,
    },
    {
      name: "hoptacxa_phone_number",
      label: "Số điện thoại hợp tác xã",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Số điện thoại hợp tác xã"></Input>
      ),
    },
    {
      name: "nhacungcapvattu_name",
      label: "Tên nhà cung cấp vật tư",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Tên nhà cung cấp vật tư"></Input>
      ),
    },
    {
      name: "nhacungcapvattun_phone_number",
      label: "Số điện thoại nhà cung cấp vật tư",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Số điện thoại nhà cung cấp vật tư"></Input>
      ),
    },
    {
      name: "img_lohang",
      label: "",
      formChildren: (
        <UploadImag
          image={deatailContract?.data?.data?.img_lohang || null}
          onChange={handleChangeImage}
        ></UploadImag>
      ),
    },
    // {
    //   name: "created_at",
    //   label: "Ngày tạo",
    //   rules: [
    //     {
    //       required: true,
    //     },
    //   ],
    //   formChildren: (
    //     <DatePicker placeholder="Ngày tạo" style={{ width: "100%" }} />
    //   ),
    // },
    // {
    //   name: "updated_at",
    //   label: "Ngày chỉnh sửa",
    //   rules: [
    //     {
    //       required: true,
    //     },
    //   ],
    //   formChildren: (
    //     <DatePicker placeholder="Ngày chỉnh sửa" style={{ width: "100%" }} />
    //   ),
    // },
  ];

  const handleFormSubmit = (values: any) => {
    values.description_giaodich = ckData || "";

    const formData: any = new FormData();
    formData.append("img_lohang", file || null);
    formData.append("description_giaodich", values.description_giaodich);
    formData.append("soluong", values.soluong);
    formData.append("price", values.price);

    mutation_update_shop_contract.mutate(formData, {
      onSuccess: (res) => {
        getResponseMessage(res);
        deatailContract.refetch();
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_update_shop_contract = useMutation((data: any) =>
    shopContractApi.update(
      data,
      deatailContract?.data?.data?.id_giaodich_luagiong || ""
    )
  );

  let result: any = {};

  if (deatailContract?.data?.data) {
    result.hoptacxa_xacnhan =
      deatailContract?.data?.data.hoptacxa_xacnhan == 0
        ? "chưa xác nhận"
        : "xác nhận";
    result.nhacungcap_xacnhan =
      deatailContract?.data?.data.nhacungcap_xacnhan == 0
        ? "chưa xác nhận"
        : "xác nhận";
    result.status =
      deatailContract?.data?.data.status == 0
        ? "chưa hoàn thành"
        : "hoàn thành";
    result.xavien_xacnhan =
      deatailContract?.data?.data.xavien_xacnhan == 0
        ? "chưa xác nhận"
        : "xác nhận";
    result = { ...deatailContract?.data?.data, ...result };
  }

  const headerBreadcrumb = [
    {
      name: "Nhà cung cấp vật tư",
      path: "/shop",
    },
    {
      name: "Quản lý hợp đồng",
      path: "/contract-management",
    },
    {
      name: "Chi tiết",
      path: "/detail",
    },
  ];

  const handleConfirm = () => {
    confirm_contract.mutate(id, {
      onSuccess: (res) => {
        getResponseMessage(res);
        deatailContract.refetch();
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const confirm_contract = useMutation((id: any) =>
    shopContractApi.confirm(id)
  );

  const approve_contract = useMutation((data: any) =>
    shopContractApi.approve(data, data?.id || "")
  );

  const handleApprove = (val: any) => {
    if (val != 2) {
      approve_contract.mutate(
        {
          id: id,
          hoptacxa_xacnhan: val || "",
        },
        {
          onSuccess: (res) => {
            getResponseMessage(res);
            deatailContract.refetch();
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

  const handleSubmitApprove = () => {
    approve_contract.mutate(
      {
        id: id,
        hoptacxa_xacnhan: 2,
        reason: reasonValue,
      },
      {
        onSuccess: (res) => {
          getResponseMessage(res);
          setShowReason(false);
          deatailContract.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  return (
    <Spin spinning={deatailContract.isLoading || approve_contract.isLoading}>
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
              handleSubmitApprove();
            }
          }}
        />
        <br />
        <Button
          loading={approve_contract.isLoading}
          type="primary"
          onClick={handleSubmitApprove}
        >
          Lưu
        </Button>
      </Modal>
      <div className="detail-contract" style={{ minHeight: "100vh" }}>
        <PageHeader
          onApprove={handleApprove}
          edit={true}
          headerBreadcrumb={headerBreadcrumb}
          form="shop=detail-contract"
          loading={mutation_update_shop_contract.isLoading}
          isConfirm={!baseUrl?.includes("chunhiem")}
          onConfirm={handleConfirm}
          confirmLoading={confirm_contract.isLoading}
          isAllowApprove={baseUrl?.includes("chunhiem")}
          disableApprove={deatailContract?.data?.data?.hoptacxa_xacnhan != 0}
          allowApprove={deatailContract?.data?.data?.hoptacxa_xacnhan}
          disabledSelect={
            baseUrl?.includes("chunhiem") &&
            (!deatailContract?.data?.data?.xavien_xacnhan ||
              !deatailContract?.data?.data?.nhacungcap_xacnhan)
          }
          toggleConfirm={
            baseUrl?.includes("htx")
              ? deatailContract?.data?.data?.xavien_xacnhan
              : deatailContract?.data?.data?.nhacungcap_xacnhan
          }
        ></PageHeader>
        {result && Object.keys(result).length > 0 && (
          <FormComponent
            initialValues={result}
            onSubmit={handleFormSubmit}
            name="shop=detail-contract"
            buttonSubmit="Cập nhật"
            hideBtnSubmit
            data={contractDetailForm}
            setData={false}
          ></FormComponent>
        )}
      </div>
      <br />
    </Spin>
  );
};

export default DetailShopContract;
