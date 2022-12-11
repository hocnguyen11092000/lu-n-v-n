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
import postApi from "../../../../api/post";

type Props = {
  baseUrl?: string;
};

const CreatePost = ({ baseUrl }: Props) => {
  const [ckData, setCkData] = useState("Nội dung bài viết");
  const [showReason, setShowReason] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [file, setFile] = useState(null);

  const { id } = useParams();

  const fetchDetailContract = (id: any) => {
    return shopContractApi.getDetail(id);
  };

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  const contractDetailForm = [
    {
      name: "title_post",
      label: "Tiêu đề",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input.TextArea placeholder="Tiêu đề"></Input.TextArea>,
    },
    {
      name: "short_description",
      label: "Mô tả ngắn",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input.TextArea placeholder="Mô tả ngắn"></Input.TextArea>,
    },
    {
      name: "description",
      label: "Mô tả ",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input.TextArea placeholder="Mô tả"></Input.TextArea>,
    },
    {
      name: "",
      label: "",
      formChildren: <Input.TextArea hidden placeholder=""></Input.TextArea>,
    },
    {
      name: "image",
      label: "",
      formChildren: (
        <UploadImag image={null} onChange={handleChangeImage}></UploadImag>
      ),
    },
    {
      editor: (
        <div>
          <p>Nội dung</p>
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
            data={ckData}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              setCkData(data);
            }}
          />
          <div
            style={{ color: "#ff4d4f", margin: "8px 0 0 0", fontSize: "13px" }}
          >
            {ckData === "" && "Trường này không được bỏ trống"}
          </div>
          <br />
        </div>
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
    values.content = ckData || "";

    const formData: any = new FormData();
    formData.append("image", file || null);
    formData.append("title_post", values.title_post);
    formData.append("short_description", values.short_description);
    formData.append("description", values.description);
    formData.append("content", values.content);

    mutation_create_post.mutate(formData, {
      onSuccess: (res) => {
        getResponseMessage(res);
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_create_post = useMutation((data) => postApi.create(data));

  const headerBreadcrumb = [
    {
      name: "Quản lý bài viết",
      path: "/post",
    },
    {
      name: "Tạo bài viết",
      path: "/create",
    },
  ];

  return (
    <Spin spinning={false}>
      <div className="detail-contract" style={{ minHeight: "100vh" }}>
        <PageHeader
          allowSave
          edit={true}
          headerBreadcrumb={headerBreadcrumb}
          form="create-post"
          loading={mutation_create_post.isLoading}
        ></PageHeader>
        <FormComponent
          onSubmit={handleFormSubmit}
          name="create-post"
          buttonSubmit="Tạo bài viết"
          hideBtnSubmit
          data={contractDetailForm}
        ></FormComponent>
      </div>
      <br />
    </Spin>
  );
};

export default CreatePost;
