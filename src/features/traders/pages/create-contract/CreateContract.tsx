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
import traderApi from "../../../../api/trader";
import AutoComplete from "../../../../components/auto-complete/AutoComplete";
import { PATH } from "../../../../enum";
import { searchUser } from "../../../../redux/contractSlice";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { validateMessage } from "../../../../utils/validateMessage";

import "./create-trader.scss";

type Props = {};

const CreateContract = (props: Props) => {
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>(undefined);
  const [ckData, setCkData] = useState();
  const [seachValue, setSearchValue] = useState<string>("");
  const [dataContract, setDataContract] = useState<any>({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchUserStore = useSelector(
    (state: any) => state.contract.searchUser
  );

  useEffect(() => {
    setUser(searchUserStore);
  }, []);

  const mutation_create_contract = useMutation((data: any) => {
    return contractApi.create(data);
  });

  const handleSubmitForm = (values: any) => {
    values.id_hoptacxa = user?.id_hoptacxa || "";
    values.description_hopdongmuaban = ckData || "";

    mutation_create_contract.mutate(values, {
      onSuccess: (data: any) => {
        getResponseMessage(data);
        navigate("/trader/contract-management");
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const fetchDetailTrader = async () => {
    const res = await traderApi.getDetail();
    if (res.data) {
      setDataContract((pre: any) => {
        return {
          ...pre,
          trader: res.data || null,
        };
      });
    }

    return res;
  };

  const detailTrader = useQuery<any>(["contract/detail"], fetchDetailTrader);

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
      { phone_number: seachValue },
      {
        onSuccess: (data) => {
          setUser(data.data);
          dispatch(searchUser(data.data));

          setDataContract((pre: any) => {
            return {
              ...pre,
              user: data.data || {},
            };
          });
        },
        onError: () => {
          setUser(null);
        },
      }
    );
  };

  const mutation = useMutation((value: any) => {
    return contractApi.searchUser(value);
  });

  if (user && Object.keys(user).length > 0) {
    form.setFieldsValue({ ...user });
  }

  return (
    <Spin spinning={detailTrader.isLoading || detailTrader.isFetching}>
      <div className="create-contract">
        <h3 className="create-contract-heading">Tạo hợp đồng</h3>
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
                  label="Tên hợp đồng"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input
                    placeholder="Tên hơp đồng"
                    onChange={(e) =>
                      setDataContract((pre: any) => {
                        return {
                          ...pre,
                          title: e.target.value || "",
                        };
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <div
                  className="add-user-to-htx__search"
                  style={{ position: "relative", top: "-2px" }}
                >
                  <Input
                    defaultValue={searchUserStore?.phone_number}
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
                    {detailTrader.isLoading && "Đang tải dữ liệu..."}
                    {detailTrader && detailTrader.data && (
                      <>
                        <p className="align-center">
                          <span className="trader-label"> Tên thương lái:</span>
                          <span className="trader-detail">
                            {detailTrader.data?.data?.name_thuonglai || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> Số điện thoại: </span>
                          <span className="trader-detail">
                            {detailTrader.data?.data?.phone_number || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label"> Đại chỉ: </span>
                          <span className="trader-detail">
                            {detailTrader.data?.data?.address || ""}
                          </span>
                        </p>
                        <p className="align-center">
                          <span className="trader-label">
                            {" "}
                            Người đại diện:{" "}
                          </span>
                          <span className="trader-detail">
                            {detailTrader.data?.data?.fullname || ""}
                          </span>
                        </p>
                      </>
                    )}
                  </Collapse.Panel>
                </Collapse>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                {user === undefined &&
                  "Tìm kiếm hợp tác xã bạn muốn tạo hợp đồng"}
                {user === null && "Không tìm thấy hợp tác xã"}
                {user && (
                  <Collapse defaultActiveKey={["B"]} bordered={false}>
                    <Collapse.Panel header="Bên B" key="B">
                      {user && (
                        <>
                          <p className="align-center">
                            <span className="trader-label">
                              {" "}
                              Tên hợp tác xã:
                            </span>
                            <span className="trader-detail">
                              {user?.name_hoptacxa || ""}
                            </span>
                          </p>
                          <p className="align-center">
                            <span className="trader-label">
                              {" "}
                              Số điện thoại:{" "}
                            </span>
                            <span className="trader-detail">
                              {user?.phone_number_hoptacxa || ""}
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
                    <Form.Item
                      name="id_lichmuavu"
                      label="Mùa vụ"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select
                        disabled
                        placeholder="Mùa vụ"
                        onChange={(value: any) =>
                          setDataContract((pre: any) => {
                            const name = season?.data?.data.find(
                              (item: any) => item?.id_lichmuavu === value
                            );
                            return {
                              ...pre,
                              season: name,
                            };
                          })
                        }
                      >
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
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <AutoComplete
                      disabled
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
                </Row>
                <Row gutter={24}>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <AutoComplete
                      onSelect={(value: any) =>
                        setDataContract((pre: any) => {
                          return { ...pre, category: value || "" };
                        })
                      }
                      returnName
                      type="danhmucquydinh"
                      Key="id_danhmucquydinh"
                      Value="name_danhmucquydinh"
                      name="id_danhmucquydinh"
                      lable="Danh mục quy định"
                      placeholder="Danh mục quy định"
                    ></AutoComplete>
                  </Col>
                  <Col lg={12} md={12} sm={24} xs={24}>
                    <Form.Item
                      name="price"
                      label="Giá thu mua"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <InputNumber
                        onChange={(e) =>
                          setDataContract((pre: any) => {
                            return {
                              ...pre,
                              price: e || "",
                            };
                          })
                        }
                        className="radius-6"
                        style={{ width: "100%" }}
                        placeholder="Giá thu mua"
                      />
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
                        setDataContract((pre: any) => {
                          return {
                            ...pre,
                            desc: data || null,
                          };
                        });
                        setCkData(data);
                      }}
                    />
                    <div style={{ color: "#ff4d4f", margin: "8px 0 0 0" }}>
                      {ckData === "" && "Trường này không được bỏ trống"}
                    </div>
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

export default CreateContract;
