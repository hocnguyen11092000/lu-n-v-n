import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import queryString from "query-string";
import postApi from "../../../../api/post";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";

type Props = {
  baseUrl?: string;
  role?: string;
};

const PostMangement = ({ baseUrl, role }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showReason, setShowReason] = useState(false);
  const [reasonValue, setReasonValue] = useState("");
  const [deleteId, setDeleteId] = useState<any>();

  const navigate = useNavigate();
  const [filter, setFilter] = useState({
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 5,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    (() => {
      navigate(
        `/${baseUrl || "htx"}/post-management?${queryString.stringify(filter)}`
      );
    })();
  }, [filter]);
  // console.log(role);

  const fetchListPost = (filter: any) => postApi.getMyPost(filter);

  const postList: any = useQuery(["post/list", filter], () =>
    fetchListPost(filter)
  );

  const handleConfirmDeletePost = async (id: string | number) => {
    try {
      const res = await postApi.delete(id);
      getResponseMessage(res);
      postList.refetch();
    } catch (error) {
      getErrorMessage(error);
    }
  };

  // const mutation_delete_post = useMutation((id: any) => postApi.delete(id));

  const tableColumns: any = [
    {
      title: "ID",
      dataIndex: "id_post",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title_post",
    },
    {
      title: "hình ảnh",
      dataIndex: "image",
      render: (text: any, record: any) => {
        return (
          <img
            src={record?.image || ""}
            width={"60px"}
            alt=""
            className="radius-6"
          />
        );
      },
    },
    {
      title: "Mô tả ngắn",
      dataIndex: "short_description",
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (text: any, record: any) => (
        <>
          <span
            style={{ cursor: "pointer", marginRight: "12px" }}
            onClick={(e) => {
              navigate(`/htx/post-management/detail/${record?.id_post || ""}`);
            }}
          >
            <EditOutlined />
          </span>
          <span
            style={{ cursor: "pointer" }}
            className=""
            onClick={(e) => {
              console.log(e);
            }}
          >
            <Popconfirm
              placement="topRight"
              title="Xóa bài viết?"
              onConfirm={() => handleConfirmDeletePost(record?.id_post || "")}
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        </>
      ),
    },
  ];

  const handlePagination = (page: number) => {
    setFilter((pre) => {
      return {
        ...pre,
        page,
      };
    });
  };

  return (
    <div className="shop-management">
      <Button>
        <Link to={`/${baseUrl}/post-management/create`}>Tạo bài viết</Link>
      </Button>
      <h3 style={{ margin: "16px 0" }}>Danh sách bài viết </h3>
      <Table
        loading={postList.isLoading}
        columns={tableColumns}
        dataSource={postList?.data?.data || []}
        pagination={false}
      />
      <div className="pagiantion">
        {postList?.data?.meta?.total > 0 && (
          <Pagination
            // defaultCurrent={filter?.page as number}
            current={Number(filter.page)}
            total={postList?.data?.meta?.total}
            pageSize={filter?.limit as number}
            onChange={handlePagination}
          />
        )}
      </div>
    </div>
  );
};

export default PostMangement;
