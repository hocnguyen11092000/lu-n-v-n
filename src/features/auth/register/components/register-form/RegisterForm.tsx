import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import "moment/locale/zh-cn";
import { Link } from "react-router-dom";
import AnimateComp from "../../../../../components/animate/AnimateCom";
import { IRoleOfUser } from "../../../../../model";
import { formatMoment } from "../../../../../utils/formatMoment";
import { validateMessage } from "../../../../../utils/validateMessage";
import "./register-form.scss";

const { Option } = Select;

type Props = {
  userRole: IRoleOfUser[];
  onSubmit: (values: IRegisterValues) => void;
  loading: boolean;
};

export interface IRegisterValues {
  fullname: string;
  email: string;
  password: string;
  phone_number: number | string;
  dob: any;
  address: string;
  account_type: Array<string | number> | string;
}

const RegisterForm = ({ userRole, onSubmit, loading }: Props) => {
  const [form] = Form.useForm();

  const onFinish = (values: IRegisterValues) => {
    values.dob = formatMoment(values.dob);
    values.account_type = `[${values.account_type.toString()}]`;

    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <AnimateComp>
      <div className="register-form">
        <div className="register-form__heading">Đăng ký</div>
        <Form
          validateMessages={validateMessage()}
          form={form}
          layout="vertical"
          name="register"
          onFinish={onFinish}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="fullname"
                label="Họ tên"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder="Họ tên" />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                  },
                  {
                    pattern:
                      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                    message: "Số điện thoại không đúng định dạng",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: "date",
                  },
                ]}
              >
                <DatePicker placeholder="Ngày sinh" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Nhập lại mật khẩu"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Nhập lại mật khẩu không đúng")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                  },
                  {
                    required: true,
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="account_type"
                label="Loại tài khoản"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn loại tài khoản",
                  },
                ]}
              >
                <Select placeholder="Loại tài khoản">
                  {userRole &&
                    userRole.map((item) => {
                      return (
                        <Select.Option key={item.code} value={item.code}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                </Select>
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea
                  style={{ height: "147px" }}
                  placeholder="Ví dụ: ấp Thống, xã Hòa Hưng, huyện Cái Bè, tỉnh Tiền Giang"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="btn"
                >
                  Đăng ký
                </Button>
                <span className="link-to">
                  Đã có tài khoản ? <Link to="/login">Đăng Nhập</Link>
                </span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </AnimateComp>
  );
};

export default RegisterForm;
