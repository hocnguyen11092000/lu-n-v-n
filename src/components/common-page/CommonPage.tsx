import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./common-page.scss";
import queryString from "query-string";
import commontApi from "../../api/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getResponseMessage } from "../../utils/getResponseMessage";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { validateMessage } from "../../utils/validateMessage";

type Props = {
  newPage?: boolean;
  buttonTitle?: string;
  modalTitle?: string;
  modalWidth?: number;
  modalChildren?: any;
  tableColumns?: any;
  commonUrl?: string;
  buttonSubmit?: string;
  submitUrl?: string;
  commonHeading?: string;
  baseUrl?: string;
  linkToNewPage?: string;
  initialValue?: any;
  isShowModal?: boolean;
  onChangeModal?: any;
  loadingModal?: boolean;
  updateTitle?: string;
  isUpdate?: boolean;
  updateUrl?: string;
  onEdit?: any;
  name?: string;
  deleteId?: string;
  allowCreate?: boolean;
  allowDelete?: boolean;
  allowUpdate?: boolean;
  fullCol?: boolean;
  refetchPage?: string;
  tableLoading?: boolean;
  cacheTime?: number;
};

const CommonPage = (props: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  const [form] = Form.useForm();
  const [commonForm] = Form.useForm();
  const navigate = useNavigate();
  const pathName = location.pathname.split("/")[1] || "";
  const {
    buttonTitle,
    modalTitle,
    modalWidth,
    modalChildren,
    tableColumns,
    commonUrl,
    buttonSubmit,
    submitUrl,
    commonHeading,
    baseUrl,
    newPage,
    linkToNewPage,
    initialValue,
    isShowModal = false,
    onChangeModal,
    loadingModal,
    updateTitle = "cập nhật",
    isUpdate = false,
    updateUrl,
    onEdit,
    name,
    deleteId,
    allowCreate = true,
    allowDelete = true,
    fullCol = false,
    refetchPage,
    tableLoading = false,
    cacheTime,
  } = props;

  useEffect(() => {
    refetch();
  }, [refetchPage]);

  useEffect(() => {
    (() => {
      navigate(
        `/${baseUrl || baseUrl || "/"}?${queryString.stringify(filter)}`
      );
    })();
  }, [filter]);

  useEffect(() => {
    setIsModalOpen(isShowModal);
  }, [isShowModal]);

  useEffect(() => {
    refetch();
  }, [deleteId]);

  let dataChildren = [];

  if (modalChildren && modalChildren.length > 0) {
    dataChildren = modalChildren.map((item: any, index: number) => {
      if (fullCol) {
        return (
          <Col lg={24} md={24} sm={24} xs={24}>
            <Form.Item
              name={item?.name}
              label={item?.label}
              rules={[item.rules]}
            >
              {item.formChildren}
            </Form.Item>
          </Col>
        );
      } else {
        return index % 2 === 0 ? (
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name={item?.name}
              label={item?.label}
              rules={[item.rules]}
            >
              {item.formChildren}
            </Form.Item>
          </Col>
        ) : (
          <Col lg={12} md={12} sm={24} xs={24}>
            <Form.Item
              name={item?.name}
              label={item?.label}
              rules={[item.rules]}
            >
              {item.formChildren}
            </Form.Item>
          </Col>
        );
      }
    });
  }

  const fetchCommonList = (filter: any) => {
    return commontApi.getAll(commonUrl || "", filter);
  };

  const { isLoading, isError, data, error, isFetching, refetch } =
    useQuery<any>([name || "", filter], () => fetchCommonList(filter), {
      cacheTime: cacheTime,
    });

  const showModalAdd = () => {
    commonForm.resetFields();
    setIsModalOpen(true);
    onChangeModal && onChangeModal(true);
    onEdit && onEdit(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onChangeModal && onChangeModal(false);
  };

  const handleSearch = (value: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleSubmitCommonForm = (values: any) => {
    commonForm.setFieldsValue(values);

    if (!isUpdate) {
      mutation_common.mutate(values, {
        onSuccess: (res) => {
          setIsModalOpen(false);
          onChangeModal && onChangeModal(false);
          getResponseMessage(res);
          refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    } else {
      values.id_danhmucquydinh = initialValue?.id_danhmucquydinh || "";

      mutation_common_update.mutate(values, {
        onSuccess: (res) => {
          setIsModalOpen(false);
          onChangeModal && onChangeModal(false);
          getResponseMessage(res);
          refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      });
    }
  };

  const mutation_common = useMutation((data: any) =>
    commontApi.create(submitUrl || "", data)
  );

  const mutation_common_update = useMutation((data: any) =>
    commontApi.update(updateUrl || "", data)
  );

  if (
    initialValue &&
    isUpdate &&
    !mutation_common.isLoading &&
    !mutation_common_update.isLoading
  ) {
    commonForm.setFieldsValue({ ...initialValue });
  }

  return (
    <div className="common-page">
      {!newPage && allowCreate && (
        <Button onClick={showModalAdd}>{buttonTitle || ""}</Button>
      )}
      {newPage && allowCreate && (
        <Button>
          <Link to={linkToNewPage || ""}>{buttonTitle || ""}</Link>
        </Button>
      )}
      <Modal
        title={isUpdate ? "Cập nhật" : modalTitle || ""}
        onOk={handleCancel}
        open={isModalOpen}
        onCancel={handleCancel}
        width={modalWidth || "70%"}
      >
        <Spin
          spinning={
            loadingModal ||
            mutation_common_update.isLoading ||
            mutation_common.isLoading
          }
        >
          <Form
            form={commonForm}
            layout="vertical"
            name="common-form"
            validateMessages={validateMessage()}
            onFinish={handleSubmitCommonForm}
          >
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              {dataChildren.length > 0 && dataChildren}
            </Row>
            <Row>
              <div className="common-form-submit">
                {!isUpdate && (
                  <Button
                    loading={mutation_common.isLoading}
                    form="common-form"
                    type="primary"
                    htmlType="submit"
                  >
                    {buttonSubmit || "Thực hiện"}
                  </Button>
                )}
                {isUpdate && (
                  <Button form="common-form" type="primary" htmlType="submit">
                    {updateTitle || "Cập nhật"}
                  </Button>
                )}
              </div>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <div className="list-user">
        <br />
        <h3>{commonHeading || "Danh sách"}</h3>
        <div className="common-search">
          <Form
            form={form}
            layout="vertical"
            name="search-activity"
            onFinish={handleSearch}
          >
            <Form.Item name="search">
              <Space>
                <Input
                  defaultValue={filter.search}
                  placeholder="Tìm kiếm..."
                ></Input>
                <Button type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
        <Table
          loading={isLoading || tableLoading}
          columns={tableColumns}
          dataSource={data?.data || []}
          pagination={false}
        />
        <div className="pagiantion">
          {data?.meta?.total > 0 && (
            <Pagination
              size="small"
              // defaultCurrent={filter?.page as number}
              current={Number(filter.page)}
              total={data?.meta?.total}
              pageSize={filter?.limit as number}
              onChange={handlePagination}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonPage;
