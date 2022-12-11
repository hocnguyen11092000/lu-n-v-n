import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Button, Input, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FormComponent from "../../../../components/form-component/FormComponent";
import shopContractApi from "../../../../api/shopContract";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageHeader from "../../../../components/page-header/PageHeader";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import UploadImag from "../../../../components/upload-image/UploadImage";
import userRiceTransactionApi from "../../../../api/userRiceTransaction";
import { formatPrice } from "../../../../utils/formatPrice";

type Props = {
  baseUrl?: string;
};

const DetailRiceTransactionUser = ({ baseUrl }: Props) => {
  const [ckData, setCkData] = useState();
  const [showReason, setShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const { id } = useParams();

  const fetchDetailContract = (id: any) => {
    return userRiceTransactionApi.getDetail(id);
  };

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  const deatailContract: any = useQuery(
    ["user/contract/rice/detail", id],
    () => fetchDetailContract(id),
    { cacheTime: 0 }
  );

  const contractDetailForm = [
    {
      name: "id_giaodichmuaban_lua",
      label: "ID",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="ID"></Input>,
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
      formChildren: <Input disabled placeholder="Giá"></Input>,
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
      name: "phone_number_xavien",
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

      formChildren: (
        <Input disabled placeholder="Số điện thoại hợp tác xã"></Input>
      ),
    },
    {
      name: "name_thuonglai",
      label: "Tên thương lái",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Tên thương lái"></Input>,
    },
    {
      name: "phone_number_thuonglai",
      label: "Số điện thoại thương lái",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Input disabled placeholder="Số điện thoại thương lái"></Input>
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

    mutation_update_rice_contract.mutate(formData, {
      onSuccess: (res) => {
        getResponseMessage(res);
        deatailContract.refetch();
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_update_rice_contract = useMutation((data: any) =>
    userRiceTransactionApi.update(
      data,
      deatailContract?.data?.data?.id_giaodichmuaban_lua || ""
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
    result.price = formatPrice(deatailContract?.data?.data.price || 0);
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
    {
      name: `${id}`,
      path: "/:id",
    },
  ];

  return (
    <Spin spinning={deatailContract.isLoading}>
      <div className="detail-contract" style={{ minHeight: "100vh" }}>
        <PageHeader
          allowSave={true}
          edit={true}
          headerBreadcrumb={headerBreadcrumb}
          form="shop=detail-contract"
          loading={mutation_update_rice_contract.isLoading}
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

export default DetailRiceTransactionUser;
