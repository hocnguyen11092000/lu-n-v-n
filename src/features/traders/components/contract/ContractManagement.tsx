import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Col, Form, Input, Popconfirm, Row, Tooltip } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import contractApi from "../../../../api/contract";
import CommonPage from "../../../../components/common-page/CommonPage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { validateMessage } from "../../../../utils/validateMessage";

type Props = {
  baseUrl?: string;
  allowCreate?: boolean;
  allowDelete?: boolean;
  allowUpdate?: boolean;
};

const ContractManagement = (props: Props) => {
  const {
    baseUrl,
    allowCreate = true,
    allowDelete = true,
    allowUpdate = true,
  } = props;
  const [deleteId, setDeleteId] = useState<any>();
  const navigate = useNavigate();

  const modalChildren: any = [];

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id_hopdongmuaban",
    },
    {
      title: "Thương lái",
      dataIndex: "name_thuonglai",
    },
    {
      title: "Hợp tác xã",
      dataIndex: "name_hoptacxa",
    },
    {
      title: "Giống lúa",
      dataIndex: "name_gionglua",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text: any, record: any) => (
        <>
          <span>
            {record?.status == "confirm" ? (
              <span className="confirm">Đã xác nhận</span>
            ) : record?.status == "watting" ? (
              <span className="not-confirm">Chờ xác nhận</span>
            ) : record?.status == "thuonlai-update" ? (
              <span className="not-confirm">Thương lái đã cập nhật</span>
            ) : (
              <span className="not-confirm">Hợp tác xã đã cập nhật</span>
            )}
          </span>
        </>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "title_hopdongmuaban",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            className=""
            onClick={() => {
              navigate(
                `/${baseUrl || "trader/contract-management"}/detail/` +
                  record?.id_hopdongmuaban
              );
            }}
            style={{
              display: "inline-block",
              marginRight: "16px",
              cursor: "pointer",
            }}
          >
            <Tooltip title="Xem chi tiết" key={"contract"}>
              <EyeOutlined />
            </Tooltip>
          </span>
          {allowDelete && (
            <span style={{ cursor: "pointer" }} className="">
              <Popconfirm
                placement="top"
                title="Xóa hợp đồng?"
                onConfirm={() =>
                  handleConfirmDeleteContract(record.id_hopdongmuaban || "")
                }
              >
                <DeleteOutlined />
              </Popconfirm>
            </span>
          )}
        </>
      ),
    },
  ];

  const handleConfirmDeleteContract = async (id: string | number) => {
    try {
      setDeleteId(id);
      const res = await contractApi.delete(id);
      getResponseMessage(res);
    } catch (error) {
      getErrorMessage(error);
    }
  };

  return (
    <CommonPage
      allowCreate={allowCreate}
      allowDelete={allowDelete}
      deleteId={deleteId}
      allowUpdate={allowUpdate}
      newPage
      linkToNewPage="/trader/contract-management/contract-create"
      buttonTitle="Tạo hợp đồng"
      tableColumns={tableColumns}
      commonHeading="Danh sách hợp đồng"
      commonUrl="/hopdongmuaban/get-list"
      baseUrl={baseUrl || "trader/contract-management"}
      name="contract"
    ></CommonPage>
  );
};

export default ContractManagement;
