import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import contractApi from "../../../../api/contract";
import shopContractApi from "../../../../api/shopContract";
import traderApi from "../../../../api/trader";
import AutoComplete from "../../../../components/auto-complete/AutoComplete";
import { PATH } from "../../../../enum";
import { searchUser } from "../../../../redux/contractSlice";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { validateMessage } from "../../../../utils/validateMessage";
import UploadImage from "../../../../components/upload-image/UploadImage";

type Props = {};

const CreateShop = (props: Props) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>(undefined);
  const [ckData, setCkData] = useState();
  const [seachValue, setSearchValue] = useState<string>("");
  const [file, setFile] = useState();
  const [dataContract, setDataContract] = useState<any>({});
  const [searchUserError, setSearchuserError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchUserStore = useSelector(
    (state: any) => state.contract.searchUser
  );

  useEffect(() => {
    setUser(searchUserStore);
    setSearchValue(searchUserStore?.xavien_phone_number || "");
  }, []);

  const detailShop = useSelector((state: any) => state.user.user);

  const mutation_create_contract = useMutation((data: any) => {
    return shopContractApi.create(data);
  });

  const handleSubmitForm = (values: any) => {
    values.id_nhacungcapvattu = detailShop?.id_user || "";
    values.id_xavien = user?.id_user || "";
    values.id_lichmuavu = user?.id_lichmuavu || "";
    values.description_giaodich = ckData || "";
    values.img_lohang = file || null;

    const formData: any = new FormData();
    formData.append("id_xavien", values.id_xavien);
    formData.append("id_nhacungcapvattu", values.id_nhacungcapvattu);
    formData.append("id_lichmuavu", values.id_lichmuavu);
    formData.append("id_gionglua", values.id_gionglua);
    formData.append("description_giaodich", values.description_giaodich);
    formData.append("img_lohang", values.img_lohang);
    formData.append("soluong", values.soluong);
    formData.append("price", values.price);

    mutation_create_contract.mutate(formData, {
      onSuccess: (data: any) => {
        getResponseMessage(data);
        // navigate("/trader/contract-management");
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const fetchSeason = (id: string | number) => {
    if (id) {
      return contractApi.getListSeason(id);
    } else {
      return null;
    }
  };

  const season = useQuery<any>(
    ["contract/season", user?.id_hoptacxa || ""],
    () => fetchSeason(user?.id_hoptacxa || "")
  );

  const handleSeachUser = async () => {
    mutation.mutate(
      { phone_number: seachValue, type: "giaodichmuabanluagiong" },
      {
        onSuccess: (data) => {
          setUser(data.data);
          dispatch(searchUser(data.data));

          setSearchuserError("");
          setDataContract((pre: any) => {
            return {
              ...pre,
              user: data.data || {},
            };
          });
        },
        onError: (err: any) => {
          // console.log(err);
          const error: any = err?.response?.data.errorList[0];
          if (error) {
            setSearchuserError(error);
          }
          setUser(null);
        },
      }
    );
  };

  const mutation = useMutation((value: any) => {
    return shopContractApi.searchUser(value);
  });

  // if (user && Object.keys(user).length > 0) {
  //   form.setFieldsValue({ ...user });
  // }

  const handleChangeImage = (file: any) => {
    setFile(file);
  };

  return (
    <Spin spinning={false}>
      <div className="create-contract">
        <h3 className="create-contract-heading">
          Tạo hợp đồng mua bán lúa giống
        </h3>
        <br />
        <div className="create-contract-form">
          <Form
            form={form}
            layout="vertical"
            name="create-contract"
            validateMessages={validateMessage()}
            onFinish={handleSubmitForm}
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}
              style={{ alignItems: "center" }}
            >
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="title_hopdongmuaban"
                  label=""
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {/* <Input
                    placeholder="Tên hơp đồng"
                    onChange={(e) =>
                      setDataContract((pre: any) => {
                        return {
                          ...pre,
                          title: e.target.value || "",
                        };
                      })
                    }
                  /> */}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <div
                  className="add-user-to-htx__search"
                  style={{ position: "relative", top: "0" }}
                >
                  <Input
                    defaultValue={searchUserStore?.xavien_phone_number}
                    value={searchUserStore?.xavien_phone_number}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Tìm kiếm hợp tác xã"
                    size="middle"
                    style={{ borderRadius: "5px" }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleSeachUser();
                      }
                    }}
                  />
                  <Button
                    loading={mutation.isLoading}
                    type="primary"
                    style={{ borderRadius: "5px" }}
                    onClick={handleSeachUser}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Collapse defaultActiveKey={["1"]} bordered={false}>
                  <Collapse.Panel header="Bên A" key="1">
                    {detailShop && (
                      <>
                        <p className="align-center">
                          <span className="trader-label"> Tên Shop:</span>
                          <span className="trader-detail">
                            {detailShop?.fullname || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> Số điện thoại: </span>
                          <span className="trader-detail">
                            {detailShop?.phone_number || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> Đại chỉ: </span>
                          <span className="trader-detail">
                            {detailShop?.address || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> Email: </span>
                          <span className="trader-detail">
                            {detailShop.email || ""}
                          </span>
                        </p>
                      </>
                    )}
                  </Collapse.Panel>
                </Collapse>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                {user === undefined && "Tìm kiếm xã viên bạn muốn tạo hợp đồng"}
                {!user && searchUserError && "Không tìm thấy xã viên"}

                {user && (
                  <Collapse defaultActiveKey={["B"]} bordered={false}>
                    <Collapse.Panel header="Bên B" key="B">
                      {user && (
                        <>
                          <p className="align-center">
                            <span className="trader-label"> Tên xã viên:</span>
                            <span className="trader-detail">
                              {user?.fullname || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label">
                              {" "}
                              Số điện thoại:{" "}
                            </span>
                            <span className="trader-detail">
                              {user?.xavien_phone_number || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label"> Đại chỉ: </span>
                            <span className="trader-detail">
                              {user?.address || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label">
                              {" "}
                              Người đại diện:{" "}
                            </span>
                            <span className="trader-detail">
                              {user?.name_hoptacxa || ""}
                            </span>
                          </p>
                        </>
                      )}
                    </Collapse.Panel>
                  </Collapse>
                )}
              </Col>
            </Row>
            <br />
            {user && (
              <>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <AutoComplete
                      onSelect={(value: any) =>
                        setDataContract((pre: any) => {
                          return { ...pre, rice: value || "" };
                        })
                      }
                      returnName
                      keyword="name_gionglua"
                      type="gionglua"
                      Key="id_gionglua"
                      Value="name_gionglua"
                      name="id_gionglua"
                      lable="Giống lúa"
                    ></AutoComplete>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="soluong"
                      label="Số lượng"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="Số lượng"
                      ></InputNumber>
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="price"
                      label="Giá"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: "100%", borderRadius: "6px" }}
                        placeholder="Giá"
                      ></InputNumber>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <h4>Mô tả hợp đồng:</h4>
                    <CKEditor
                      editor={ClassicEditor}
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
                      data=""
                      onChange={(event: any, editor: any) => {
                        const data = editor.getData();

                        setCkData(data);
                      }}
                    />
                    <div style={{ color: "#ff4d4f", margin: "8px 0 0 0" }}>
                      {ckData === "" && "Trường này không được bỏ trống"}
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <UploadImage onChange={handleChangeImage}></UploadImage>
                  </Col>
                </Row>
                <br />
                <Row>
                  <div className="common-form-submit">
                    <Space>
                      <Button
                        disabled={ckData === ""}
                        form={"create-contract"}
                        type="primary"
                        htmlType="submit"
                        loading={mutation_create_contract.isLoading}
                      >
                        Tạo hợp đồng
                      </Button>
                      <Button
                        type="primary"
                        onClick={() =>
                          navigate(`${PATH.PREVIEW}`, {
                            state: { ...dataContract, ...user },
                          })
                        }
                      >
                        Xem trước
                      </Button>
                    </Space>
                  </div>
                </Row>
              </>
            )}
          </Form>
        </div>
        <br />
      </div>
    </Spin>
  );
};

export default CreateShop;
