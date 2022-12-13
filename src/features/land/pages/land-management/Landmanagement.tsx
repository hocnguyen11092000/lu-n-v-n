import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Switch } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import contractApi from "../../../../api/contract";
import landApi from "../../../../api/land";
import CommonPage from "../../../../components/common-page/CommonPage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";

type Props = {
  baseUrl?: string;
};

const LandManagement = (props: Props) => {
  const { baseUrl } = props;
  const [deleteId, setDeleteId] = useState<any>();
  const [refetch, setRefetch] = useState<any>();
  const [activeLoading, setActiveLoading] = useState(false);
  const navigate = useNavigate();

  const modalChildren: any = [];

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id_thuadat",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Diện tích",
      dataIndex: "dientich",
      render: (text: any, record: any) => (
        <>
          <span>
            {record?.dientich
              ? record?.dientich + " mét vuông "
              : "Không có dữ liệu"}
          </span>
        </>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      render: (text: any, record: any) => (
        <>
          <img
            style={{
              maxWidth: "80px",
              objectFit: "cover",
              borderRadius: "6px",
            }}
            src={
              record?.thumbnail ||
              "data:image/jpeg;base64,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"
            }
            alt=""
          />
        </>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      width: "15%",
      render: (text: any, record: any) => (
        <>
          {record?.location ? (
            <div
              onClick={() =>
                navigate("/htx/manage-land/map", {
                  state: {
                    position: record,
                    preview: true,
                  },
                })
              }
              style={{ cursor: "pointer" }}
            >
              <span style={{ marginRight: "12px" }}> Xem vị trí</span>
              <EyeOutlined />
            </div>
          ) : null}
        </>
      ),
    },
    {
      title: "Hoạt động",
      dataIndex: "active",
      render: (text: any, record: any) => (
        <>
          <Switch
            checked={record?.active || false}
            onChange={(e) => handleActiveLand(record?.id_thuadat || "", e)}
          ></Switch>
        </>
      ),
    },

    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            className=""
            onClick={() =>
              navigate("/htx/manage-land/detail/" + record.id_thuadat || "")
            }
            style={{
              display: "inline-block",
              marginRight: "16px",
              cursor: "pointer",
            }}
          >
            <EditOutlined />
          </span>
          <span style={{ cursor: "pointer" }} className="">
            <Popconfirm
              placement="top"
              title="Xóa thửa đất?"
              onConfirm={() =>
                handleConfirmDeleteLand(record?.id_thuadat || "")
              }
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  const handleActiveLand = async (id: string | number, e: any) => {
    setActiveLoading(true);
    try {
      const res = await landApi.active(id);
      setRefetch(new Date().toISOString());
      getResponseMessage(res);
    } catch (error) {
      getErrorMessage(error);
    } finally {
      setActiveLoading(false);
    }
  };

  const handleConfirmDeleteLand = async (id: string | number) => {
    try {
      setDeleteId(id);
      setRefetch(new Date().toISOString());
      const res = await landApi.delete(id);
      getResponseMessage(res);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  return (
    <CommonPage
      cacheTime={0}
      tableLoading={activeLoading}
      refetchPage={refetch}
      deleteId={deleteId}
      newPage
      linkToNewPage="/htx/manage-land/create"
      buttonTitle="Tạo thửa đất"
      tableColumns={tableColumns}
      commonHeading="Danh sách thửa đất"
      commonUrl="/thuadat/get-list"
      baseUrl={baseUrl || "trader/contract-management"}
      name="land/list"
    ></CommonPage>
  );
};

export default LandManagement;
