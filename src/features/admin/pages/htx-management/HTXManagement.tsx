import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Switch,
  Table,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import queryString from "query-string";
import userApi from "../../../../api/userApi";
import "./htx-management.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import htxApi from "../../../../api/htx";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const HTXManagement = () => {
  const htx = useSelector((state: any) => state.htx.role);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seachValue, setSearchValue] = useState<string>("");
  const [user, setUser] = useState<any>(undefined);
  const userStored = useSelector((state: any) => state.user.user);
  const role = useSelector((state: any) => state.htx.role);

  const mutation = useMutation((value: any) => {
    return htxApi.searchUser(value);
  });

  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    (() => {
      navigate(`/htx/manage-htx?${queryString.stringify(filter)}`);
    })();
  }, [filter]);

  const columns: ColumnsType<DataType> = [
    {
      title: "ID",
      dataIndex: "id_xavien",
      filterMode: "tree",
      filterSearch: true,
      // width: "30%",
    },
    {
      title: "Tên xã viên",
      dataIndex: "fullname",
    },
    {
      width: "15%",
      title: "Ảnh đại diện",
      dataIndex: "thumbnail",
      render: (text, record: any) => (
        <div>
          <img
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
            src={
              record?.thumbnail ||
              "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
            }
            alt=""
          />
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      // width: "40%",
    },
    {
      title: "Trạng thái",
      dataIndex: "active_switch",
      // width: "40%",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (text, record: any) => (
        <>
          <span
            style={{ cursor: "pointer" }}
            className=""
            onClick={(e) => {
              console.log(e);
            }}
          >
            <Popconfirm
              placement="top"
              title="Xóa xã viên khỏi hợp tác xã?"
              onConfirm={() => handleConfirmDeleteUser(record)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  const fetchUserList = (filter: any) => {
    return userApi.getAllUser({
      id_hoptacxa: htx.id_hoptacxa,
      ...filter,
    });
  };
  const { isLoading, isError, data, error, isFetching, refetch } =
    useQuery<any>(["user/list", filter], () => fetchUserList(filter));

  const handleChangeSwitch = (id: boolean) => {
    mutation_toggleActive.mutate(id, {
      onSuccess: (val) => {
        getResponseMessage(val);
        refetch();
      },
      onError: (err) => getErrorMessage(err),
    });
  };

  const mutation_toggleActive = useMutation((data: any) =>
    htxApi.toggleActive(data)
  );

  const handleConfirmDeleteUser = async (record: any) => {
    try {
      const res = await htxApi.deleteUser(record.id_user);
      getResponseMessage(res);
      refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };
  // console.log([...data?.data[0], ...data?.data[0]?.user]);

  let result = [];
  if (data?.data) {
    result = data?.data.map((item: any) => {
      item.active_switch = (
        <Switch
          style={{ color: "#333 !important" }}
          // checkedChildren="Hoạt động"
          // unCheckedChildren="Đang Ẩn"
          checked={item?.xavien_active || false}
          onChange={() => handleChangeSwitch(item.id_user)}
        />
      );
      return {
        ...item,
        ...item?.user,
      };
    });
  }

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleSearchUser = (value: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSeachUser = async () => {
    mutation.mutate(
      { phone_number: seachValue },
      {
        onSuccess: (data) => {
          setUser(data.data);
        },
        onError: () => {
          setUser(null);
        },
      }
    );
  };

  const mutation_addUser = useMutation((data: any) =>
    htxApi.addNewMember(data)
  );

  const handleAddUserToHTX = () => {
    const data = {
      id_user: user?.id_user,
      id_hoptacxa: role?.id_hoptacxa,
    };

    mutation_addUser.mutate(data, {
      onSuccess: () => {
        message.success("Thêm xã viên thành công");
        setIsModalOpen(false);
        refetch();
      },
      onError: (error) => {
        getErrorMessage(error);
      },
    });
  };

  return (
    <div className="htx-management">
      <Button onClick={showModal}>Thêm xã viên</Button>
      <Modal
        title="Thêm xã viên vào hợp tác xã"
        onOk={handleCancel}
        open={isModalOpen}
        onCancel={handleCancel}
        width="40%"
        // cancelButtonProps={{ style: { display: "none" } }}
        // okButtonProps={{ style: { display: "none" } }}
      >
        <div className="add-user-to-htx">
          <Row>
            <Col span={24}>
              <div className="add-user-to-htx__search">
                <Input
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm vã viên"
                  size="middle"
                  style={{ borderRadius: "5px" }}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
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
          <br />
          {user && (
            <Row>
              <Col span={24} className="add-user-to-htx-des">
                {/* <Descriptions title="Thông tin xã viên">
                  <Descriptions.Item label="Tên Xã Viên">
                    {user && user?.fullname}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {user && user?.phone_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    {user && user?.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    {user && user?.dob}
                  </Descriptions.Item>
                </Descriptions> */}
                {user && (
                  <>
                    <p className="align-center">
                      <span className="trader-label">Họ tên:</span>
                      <span className="trader-detail">
                        {user?.fullname || ""}
                      </span>
                    </p>
                    <p className="align-center">
                      <span className="trader-label"> Số điện thoại: </span>
                      <span className="trader-detail">
                        {user?.phone_number || ""}
                      </span>
                    </p>
                    <p className="align-center">
                      <span className="trader-label"> Đại chỉ: </span>
                      <span className="trader-detail">
                        {user?.address || ""}
                      </span>
                    </p>
                    <p className="align-center">
                      <span className="trader-label">Ngày sinh: </span>
                      <span className="trader-detail">{user?.dob || ""}</span>
                    </p>
                    <br />
                  </>
                )}
              </Col>

              <Col span={24}>
                <Button
                  loading={mutation_addUser.isLoading}
                  type="primary"
                  onClick={handleAddUserToHTX}
                >
                  Thêm xã viên
                </Button>
              </Col>
            </Row>
          )}
          {user === null && <div>Không tìm thấy xã viên</div>}
        </div>
      </Modal>
      <div className="list-user">
        <br />
        <h3>Danh sách xã viên</h3>
        <div className="seach-user">
          <Form
            form={form}
            layout="vertical"
            name="search-activity"
            onFinish={handleSearchUser}
          >
            <Form.Item name="search">
              <Space>
                <Input
                  defaultValue={filter.search}
                  placeholder="Tìm kiếm hoạt động"
                ></Input>
                <Button type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <Table
          loading={isLoading || mutation_toggleActive.isLoading}
          columns={columns}
          dataSource={result}
          pagination={false}
        />
        <div className="pagiantion">
          {data?.meta?.total > 0 && (
            <Pagination
              // defaultCurrent={filter.page as number}
              total={data?.meta?.total}
              pageSize={filter.limit as number}
              onChange={handlePagination}
              current={Number(filter.page)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HTXManagement;
