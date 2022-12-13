import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Spin,
  Switch,
  Table,
  TableColumnsType,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import categoryApi from "../../../../api/category";
import supplierApi from "../../../../api/supplier";
import FormComponent from "../../../../components/form-component/FormComponent";
import PageHeader from "../../../../components/page-header/PageHeader";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import queryString from "query-string";
import "./detail-category.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { validateMessage } from "../../../../utils/validateMessage";
type Props = {};

const DetailCategory = (props: Props) => {
  const { id } = useParams();
  const [loadingDetailSup, setLoadingDetailSup] = useState(false);
  const [supId, setSupId] = useState<any>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppilerDetail, setSuppilerDetail] = useState();
  const navigate = useNavigate();
  const [form2] = Form.useForm();
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeLoading, setActiveLoading] = useState(false);

  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  const showModal = () => {
    form.resetFields();
    setSuppilerDetail(undefined);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleActiveCategory = async (id: string | number, e: any) => {
    // setActiveLoading(true);
    // try {
    //   const res = await landApi.active(id);
    //   setRefetch(new Date().toISOString());
    //   getResponseMessage(res);
    // } catch (error) {
    //   getErrorMessage(error);
    // } finally {
    //   setActiveLoading(false);
    // }
  };

  useEffect(() => {
    (() => {
      navigate(
        `/trader/category-management/detail/${id}?${queryString.stringify(
          filter
        )}`
      );
    })();
  }, [filter]);

  const columns = useMemo(() => {
    const columns: TableColumnsType<any> = [
      {
        title: "ID vật tư",
        dataIndex: "id_category_vattu",
      },
      {
        title: "Tên vật tư",
        dataIndex: "name_category_vattu",
      },
      {
        title: "Hoạt động",
        dataIndex: "active",
        render: (text, record: any) => (
          <>
            <Switch
              onChange={(e) =>
                handleActiveCategory(record?.id_category_vattu || "", e)
              }
              checked={record?.active || false}
            ></Switch>
          </>
        ),
      },
      {
        title: "Hành động",
        dataIndex: "",
        key: "x",
        render: (text, record: any) => (
          <>
            <span
              className=""
              onClick={() =>
                handleEditSupplier(record?.id_category_vattu || "")
              }
              style={{
                display: "inline-block",
                marginRight: "16px",
                cursor: "pointer",
              }}
            >
              <EditOutlined />
            </span>
            <span className="" style={{ cursor: "pointer" }}>
              <Popconfirm
                placement="top"
                title="Xóa vật tư?"
                onConfirm={() =>
                  handleConfirmDeleteSupp(record?.id_category_vattu || "")
                }
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
          </>
        ),
      },
    ];

    return columns;
  }, []);

  const handleConfirmDeleteSupp = async (id: string | number) => {
    try {
      const res = await supplierApi.delete(id);
      getResponseMessage(res);
      suppiler.refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };

  const handleEditSupplier = async (id: number) => {
    setLoadingDetailSup(true);
    setIsModalOpen(true);
    setSupId(id);

    try {
      const res = await supplierApi.getDetail(id);
      setSuppilerDetail(res.data);
      form.setFieldsValue({ ...res.data });
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setLoadingDetailSup(false);
    }
  };

  const fetchCategoryDetail = (id: any) => {
    return categoryApi.getDetail(id);
  };

  const detailCategory = useQuery(["category/detail", id], () =>
    fetchCategoryDetail(id)
  ) as any;

  const categoryDetailForm = [
    {
      name: "name_danhmucquydinh",
      label: "Tên danh mục",
      rules: [
        {
          required: true,
        },
      ],
      formChildren: <Input placeholder="Tên danh mục"></Input>,
    },
  ];

  const handleFormSubmit = (values: any) => {
    mutation_update_category.mutate(values, {
      onSuccess: (res) => {
        getResponseMessage(res);
      },
      onError: (err) => getErrorMessage(err),
    });
  };

  const mutation_update_category = useMutation((data: any) =>
    categoryApi.update(id, data)
  );

  const header = [
    {
      name: "Thương lái",
      path: "",
    },
    {
      name: "Danh mục qui định ",
      path: "",
    },
    {
      name: "chi tiết",
      path: "",
    },
  ];

  const fetchSuppiler = (filter: any) => {
    return supplierApi.getAll({
      danhmucquydinh: id,
      ...filter,
    });
  };

  const suppiler: any = useQuery(["category/suppiler", filter], () =>
    fetchSuppiler(filter)
  );

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  const handleSearchSupplier = (value: any) => {
    setFilter((pre) => {
      return {
        ...pre,
        page: 1,
        search: value?.search?.trim() || "",
      };
    });
  };

  const onSubmit = (values: any) => {
    values.id_danhmucquydinh = id || "";

    if (!suppilerDetail) {
      mutation_create_supplier.mutate(values, {
        onSuccess: (data) => {
          getResponseMessage(data);
          suppiler.refetch();
          setIsModalOpen(false);
        },
        onError: (err) => getErrorMessage(err),
      });
    } else {
      mutation_update_supplier.mutate(values, {
        onSuccess: (data) => {
          getResponseMessage(data);
          suppiler.refetch();
          setIsModalOpen(false);
        },
        onError: (err) => getErrorMessage(err),
      });
    }
  };

  const mutation_create_supplier = useMutation((values: any) =>
    supplierApi.add(values)
  );

  const mutation_update_supplier = useMutation((values: any) =>
    supplierApi.update(supId || "", values)
  );

  return (
    <div className="detail-category">
      <PageHeader
        loading={mutation_update_category.isLoading}
        headerBreadcrumb={header}
        form="detail-category"
      ></PageHeader>
      {detailCategory.isLoading && (
        <Row>
          <Col lg={10} md={10} sm={20} xs={20}>
            <Skeleton.Input
              size="small"
              style={{ width: 100, borderRadius: "5px", marginBottom: "12px" }}
              active
            ></Skeleton.Input>

            <Skeleton.Input
              style={{ width: 500, borderRadius: "5px" }}
              active
            ></Skeleton.Input>
          </Col>
        </Row>
      )}
      {detailCategory?.data?.data && (
        <FormComponent
          initialValues={detailCategory?.data?.data}
          onSubmit={handleFormSubmit}
          name="detail-category"
          buttonSubmit="Cập nhật"
          hideBtnSubmit
          data={categoryDetailForm}
        ></FormComponent>
      )}
      <Space
        align="center"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="btn btn-add-activity">
            <Button onClick={showModal} type="primary">
              Thêm vật tư
            </Button>
          </div>
        </div>
        <div className="seach-activity">
          <Form
            form={form2}
            layout="vertical"
            name="search-activity"
            id="search-activity"
            onFinish={handleSearchSupplier}
          >
            <Form.Item name="search">
              <Space>
                <Input
                  defaultValue={filter.search}
                  placeholder="Tìm kiếm hoạt động"
                ></Input>
                <Button form="search-activity" type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Space>
      <Modal
        title="Tạo vật tư"
        onOk={handleCancel}
        open={isModalOpen}
        onCancel={handleCancel}
        bodyStyle={{ height: "auto" }}
        width={600}
      >
        <Spin spinning={loadingDetailSup}>
          <Form
            validateMessages={validateMessage()}
            form={form}
            layout="vertical"
            name="add supplier"
            onFinish={onSubmit}
          >
            <Row>
              <Col lg={24} md={24} sm={24} xs={24}>
                <Form.Item
                  name="name_category_vattu"
                  label="Tên vật tư"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Tên vật tư" />
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button
                    form="add supplier"
                    type="primary"
                    htmlType="submit"
                    className="btn"
                    loading={
                      mutation_create_supplier.isLoading ||
                      mutation_update_supplier.isLoading
                    }
                  >
                    {suppilerDetail ? "Sửa" : "Thêm"}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <Table
        loading={suppiler.isLoading || suppiler.isFetching}
        columns={columns}
        dataSource={suppiler?.data?.data}
        pagination={false}
      />
      <div className="pagiantion">
        {suppiler?.data?.meta?.total > 0 && (
          <Pagination
            size="small"
            // defaultCurrent={filter.page as number}
            current={Number(filter.page)}
            total={suppiler?.data?.meta?.total}
            pageSize={filter.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>
    </div>
  );
};

export default DetailCategory;
