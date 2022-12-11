import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DatePicker, Input, Select, Spin } from "antd";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useState } from "react";
import { useParams } from "react-router-dom";
import contractApi from "../../../../api/contract";
import AutoComplete from "../../../../components/auto-complete/AutoComplete";
import FormComponent from "../../../../components/form-component/FormComponent";
import PageHeader from "../../../../components/page-header/PageHeader";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";

type Props = {
  baseUrl?: string;
  edit?: boolean;
};

// {
//   "id_hopdongmuaban": 14,
//   "title_hopdongmuaban": "New contract",
//   "description_hopdongmuaban": "<p>new&nbsp;</p>",
//   "status": "waiting",
//   "thuonglai_xacnhan": 1,
//   "hoptacxa_xacnhan": 0,
//   "created_at": "2022-10-21T14:11:34.000000Z",
//   "updated_at": "2022-10-21T14:11:34.000000Z",
//   "id_gionglua": 4,
//   "name_gionglua": "504",
//   "id_danhmucquydinh": 7,
//   "name_danhmucquydinh": "phân lân",
//   "id_lichmuavu": 58,
//   "name_lichmuavu": null,
//   "id_thuonglai": 18,
//   "name_thuonglai": "thương lái",
//   "phone_number_thuonglai": "0111111111",
//   "address_thuonglai": "Tiền Giang",
//   "daidien_thuonglai": "thương lái",
//   "id_hoptacxa": 57,
//   "name_hoptacxa": "Ký Túc Xá B",
//   "phone_number_hoptacxa": "09393939397",
//   "address_hoptacxa": "Ký Túc Xá B, Đại Học Cần Thơ",
//   "daidien_hoptacxa": "Nguyễn Văn F"
// }

const DetailContract = (props: Props) => {
  const { baseUrl, edit } = props;
  const { id } = useParams();
  const [refesh, setRefresh] = useState(false);
  const [ckData, setCkData] = useState();

  const fetchDetailContract = (id: any) => {
    return contractApi.getDetail(id);
  };

  const deatailContract: any = useQuery(
    ["contract/detail", id],
    () => fetchDetailContract(id),
    { cacheTime: 0 }
  );

  const fetchSeason = (id: string | number) => {
    if (id) {
      return contractApi.getListSeason(id);
    } else {
      return null;
    }
  };

  const season = useQuery<any>(
    ["contract/detail/season", deatailContract?.data?.data?.id_hoptacxa || ""],
    () => fetchSeason(deatailContract?.data?.data?.id_hoptacxa || "")
  );

  let result;
  if (deatailContract?.data && deatailContract?.data?.data) {
    result = {
      ...deatailContract?.data?.data,
      hoptacxa_xacnhan:
        deatailContract?.data?.data?.hoptacxa_xacnhan == 0
          ? "Chưa xác nhận"
          : "Xác nhận",
      thuonglai_xacnhan:
        deatailContract?.data?.data?.thuonglai_xacnhan == 0
          ? "Chưa xác nhận"
          : "Xác nhận",
    };
  }

  const contractDetailForm = [
    {
      name: "id_hopdongmuaban",
      label: "id hợp đồng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Id hợp đồng"></Input>,
    },
    {
      name: "title_hopdongmuaban",
      label: "Tiêu đề hợp đồng",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tiêu đề hợp đồng"></Input>,
    },
    {
      name: "status",
      label: "Trạng thái",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Select disabled defaultValue="Waitting" style={{ width: "100%" }}>
          <Select.Option value="Waitting">Đang chờ xác nhận</Select.Option>
          <Select.Option value="Success">Xác nhận</Select.Option>
        </Select>
      ),
    },
    {
      name: "thuonglai_xacnhan",
      label: "Thương lái xác nhận",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Thương lái xác nhận"></Input>,
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
      autoComplete: !baseUrl ? (
        <AutoComplete
          disabled={!baseUrl}
          returnName
          type="danhmucquydinh"
          Key="id_danhmucquydinh"
          Value="name_danhmucquydinh"
          name={"id_danhmucquydinh"}
          lable="Danh mục quy định"
        ></AutoComplete>
      ) : (
        <AutoComplete
          disabled={!!baseUrl}
          returnName
          type="danhmucquydinh"
          Key="id_danhmucquydinh"
          Value="name_danhmucquydinh"
          name={"name_danhmucquydinh"}
          lable="Danh mục quy định"
        ></AutoComplete>
      ),
    },

    {
      name: "id_lichmuavu",
      label: "Lịch mùa vụ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: (
        <Select placeholder="Mùa vụ">
          {season &&
            season?.data?.data.map((item: any) => {
              return (
                <Select.Option
                  key={item.id_lichmuavu}
                  value={item.id_lichmuavu}
                >
                  {item.name_lichmuavu}
                </Select.Option>
              );
            })}
        </Select>
      ),
    },
    {
      name: "price",
      label: "Giá thu mua",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Giá thu mua"></Input>,
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
            data={deatailContract?.data?.data?.description_hopdongmuaban || ""}
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
      name: "address_thuonglai",
      label: "Địa chỉ thương lái",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Địa chỉ thương lái"></Input>,
    },
    {
      name: "daidien_thuonglai",
      label: "Đại diện thương lái",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Đại diện thương lái"></Input>,
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
      name: "phone_number_hoptacxa",
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
      name: "address_hoptacxa",
      label: "Địa chỉ hợp tác xã",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Địa chỉ hợp tác xã"></Input>,
    },

    {
      name: "daidien_hoptacxa",
      label: "Đại diện hợp tác xã",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input disabled placeholder="Đại diện hợp tác xã"></Input>,
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
    console.log(values);

    const data = {
      id_hopdongmuaban: values.id_hopdongmuaban || "",
      id_lichmuavu: values.id_lichmuavu || "",
      id_danhmucquydinh:
        values.id_danhmucquydinh ||
        deatailContract?.data?.data.id_danhmucquydinh ||
        "",
      id_gionglua: values.id_gionglua || "",
      title_hopdongmuaban: values.title_hopdongmuaban || "",
      description_hopdongmuaban:
        ckData ||
        values.description_hopdongmuaban ||
        deatailContract?.data?.data.description_hopdongmuaban ||
        "description",
    };

    mutation_update_contract.mutate(data, {
      onSuccess: (res) => {
        getResponseMessage(res);
        setRefresh(true);
      },
      onError: (err) => getErrorMessage(err),
    });
  };

  const mutation_update_contract = useMutation((data: any) =>
    contractApi.update(data, data?.id_hopdongmuaban || "")
  );

  const headerBreadcrumb = [
    {
      name: baseUrl?.includes("htx") ? "HTX" : "Thương lái",
      path: baseUrl?.includes("htx") ? "/htx" : "/trader",
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

  const handleConfirm = () => {
    mutation_confirm_contract.mutate(id, {
      onSuccess: (res) => {
        getResponseMessage(res);
        deatailContract.refetch();
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_confirm_contract = useMutation((id: any) =>
    contractApi.confirm(id)
  );

  return (
    <Spin spinning={deatailContract.isLoading}>
      <div className="detail-contract" style={{ minHeight: "100vh" }}>
        <PageHeader
          isConfirm={deatailContract?.data?.data?.status !== "confirm"}
          toggleConfirm={
            baseUrl?.includes("htx")
              ? deatailContract?.data?.data?.hoptacxa_xacnhan
              : deatailContract?.data?.data?.thuonglai_xacnhan
          }
          confirmLoading={mutation_confirm_contract.isLoading}
          onConfirm={handleConfirm}
          edit={edit}
          headerBreadcrumb={headerBreadcrumb}
          form="detail-contract"
          loading={mutation_update_contract.isLoading}
        ></PageHeader>
        {deatailContract?.data?.data && (
          <FormComponent
            disableForm={deatailContract?.data?.data?.status == "confirm"}
            initialValues={result}
            onSubmit={handleFormSubmit}
            name="detail-contract"
            buttonSubmit="Cập nhật"
            hideBtnSubmit
            data={contractDetailForm}
          ></FormComponent>
        )}
      </div>
      <br />
    </Spin>
  );
};

export default DetailContract;
