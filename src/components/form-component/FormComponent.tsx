import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { validateMessage } from "../../utils/validateMessage";

type Props = {
  data: any;
  onSubmit?: (data: any) => void;
  name: string;
  buttonSubmit?: string;
  loading?: boolean;
  hideBtnSubmit?: boolean;
  initialValues?: any;
  onDisable?: any;
  goBackUrl?: string;
  showBack?: boolean;
  isCreate?: boolean;
  updateId?: any;
  onReset?: any;
  type?: string;
  addField?: boolean;
  onAddField?: any;
  categoryOfActivity?: any;
  onDeleteCategory?: any;
  setData?: boolean;
  disableForm?: boolean;
};

const FormComponent = ({
  data,
  onSubmit,
  name,
  buttonSubmit,
  loading = false,
  hideBtnSubmit,
  initialValues = {},
  onDisable,
  goBackUrl,
  showBack,
  isCreate,
  updateId,
  type,
  addField = false,
  onAddField,
  categoryOfActivity = [],
  onDeleteCategory,
  setData = true,
  disableForm = false,
}: Props) => {
  const [formCommon] = Form.useForm();

  useEffect(() => {
    if (type === "create") {
      formCommon.setFieldsValue({});
    }
  }, [type]);

  useEffect(() => {
    if (initialValues && setData) {
      formCommon.setFieldsValue(initialValues);
      console.log(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (isCreate) {
      formCommon.resetFields();
    }
  }, [isCreate, updateId]);

  let dataChildren = [];

  if (data && data.length > 0) {
    dataChildren = data.map((item: any, index: number) => {
      if (item.autoComplete) {
        return (
          <Col key={index} lg={12} md={12} sm={24} xs={24}>
            {item.autoComplete}
          </Col>
        );
      } else if (item.editor) {
        return (
          <Col key={index} span={24}>
            {item.editor}
          </Col>
        );
      } else {
        return index % 2 === 0 ? (
          <Col key={index} lg={12} md={12} sm={24} xs={24}>
            <Form.Item name={item?.name} label={item?.label} rules={item.rules}>
              {item.formChildren}
            </Form.Item>
          </Col>
        ) : (
          <Col key={index} lg={12} md={12} sm={24} xs={24}>
            <Form.Item name={item?.name} label={item?.label} rules={item.rules}>
              {item.formChildren}
            </Form.Item>
          </Col>
        );
      }
    });
  }

  const handleSubmitForm = (values: any) => {
    console.log(values);

    if (onSubmit) {
      onSubmit(values);
    }
  };

  const handleFieldsChange = (values: any) => {
    setTimeout(() => {
      if (onDisable) {
        if (
          formCommon.getFieldsError().filter(({ errors }) => errors.length)
            .length > 0
        ) {
          onDisable(true);
        } else {
          onDisable(false);
        }
      }
    }, 200);
  };

  const handleSubmitFormFailed = (a: any) => {
    console.log(a);
  };

  console.log(categoryOfActivity);

  return (
    <div>
      <Form
        disabled={disableForm}
        onFieldsChange={handleFieldsChange}
        form={formCommon}
        layout="vertical"
        name={name}
        validateMessages={validateMessage()}
        onFinish={handleSubmitForm}
        onFinishFailed={handleSubmitFormFailed}
        initialValues={initialValues}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
          {dataChildren.length > 0 && dataChildren}
        </Row>

        {categoryOfActivity && categoryOfActivity.length > 0 && (
          <>
            <div className="category-of-activity">
              <h3>Vật tư sử dụng: </h3>
              <div style={{ margin: "12px 0" }}>
                {categoryOfActivity.map((item: any) => {
                  return (
                    <Row gutter={[16, 16]} style={{ marginBottom: "12px" }}>
                      <Col lg={10} md={10} sm={24} xs={24}>
                        <span>
                          <span className="m-r-4"> Tên vật tư: </span>
                          <b>
                            {" "}
                            {item?.name_category_vattu
                              ? item.name_category_vattu
                              : JSON.parse(item?.id_giaodichmuaban_vattu)
                                  ?.value || ""}
                          </b>
                        </span>
                      </Col>
                      <Col lg={4} md={4} sm={24} xs={24}>
                        <span>
                          <span className="m-r-4"> Số lượng:</span>
                          <b> {item?.soluong || ""}</b>
                        </span>
                      </Col>
                      <Col lg={8} md={8} sm={24} xs={24}>
                        <span>
                          <span className="m-r-4"> Thời gia sử dụng:</span>
                          <b> {item?.timeuse || ""}</b>
                        </span>
                      </Col>
                      <Col lg={2} md={2} sm={24} xs={24}>
                        <span
                          className="cursor-poiner"
                          onClick={() =>
                            onDeleteCategory &&
                            onDeleteCategory(
                              item?.id_giaodichmuaban_vattu || ""
                            )
                          }
                        >
                          <DeleteOutlined></DeleteOutlined>
                        </span>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <Row style={{ position: "relative" }}>
          <div className="common-form-submit">
            <Space>
              <Button
                className={hideBtnSubmit ? "hide" : ""}
                loading={loading}
                form={name}
                type="primary"
                htmlType="submit"
              >
                {initialValues && Object.keys(initialValues).length > 0
                  ? "Cập nhật"
                  : buttonSubmit || "Thực hiện"}
              </Button>
              {addField && (
                <Button
                  type="primary"
                  onClick={() => onAddField && onAddField()}
                >
                  {addField ? "Thêm vật tư" : "Thêm trường"}
                </Button>
              )}
            </Space>
            {goBackUrl && showBack && (
              <Button style={{ marginLeft: "4px" }}>
                <Link to={goBackUrl}>Trở về</Link>
              </Button>
            )}
          </div>
        </Row>
      </Form>
    </div>
  );
};

export default FormComponent;
