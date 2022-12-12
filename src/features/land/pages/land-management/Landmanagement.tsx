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
            className="image-in-table"
            src={
              record?.thumbnail ||
              "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
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
