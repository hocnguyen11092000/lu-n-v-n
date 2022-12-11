import { DashOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Input, Popover, Spin, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import commentApi from "../../api/comment";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { getResponseMessage } from "../../utils/getResponseMessage";
import "./comment-item.scss";
import "moment/locale/fr";
import "moment/locale/es";
import "moment/dist/locale/vi";

type Props = {
  item: any;
  tier: any;
  idPost?: any;
  detailPost?: any;
};

const CommentItem = ({ detailPost, idPost, item, tier }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef<any>(null);
  const currentUser = useSelector((state: any) => state.user.user);

  moment.locale("vi");

  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  }, [inputRef.current]);

  const tierRef = useRef(tier);
  const [replyValue, setReplyValue] = useState("");

  const handleReply = (item: any) => {
    if (replyValue) {
      mutation_add_comment.mutate(
        {
          id_post: idPost || "",
          parent_id: item?.id_comment || null,
          image: null,
          content: replyValue,
        },
        {
          onSuccess: (data: any) => {
            getResponseMessage(data);
            setReplyValue("");
            setShowReply(!showReply);
            detailPost && detailPost.refetch();
          },
          onError: (err) => {
            setShowReply(!showReply);
            getErrorMessage(err);
          },
        }
      );
    }
  };

  const mutation_add_comment = useMutation((data: any) =>
    commentApi.create(data)
  );

  const handleToogle = (item: any) => {
    setShowReply(!showReply);

    setTimeout(() => {
      inputRef.current && inputRef.current?.focus();
    }, 250);
  };

  const handleDeleComment = (item: any) => {
    // console.log(item?.id_comment || '');
    mutation_delete_comment.mutate(item?.id_comment, {
      onSuccess: (data: any) => {
        getResponseMessage(data);
        detailPost.refetch();
      },
      onError: (err) => {
        getErrorMessage(err);
      },
    });
  };

  const mutation_delete_comment = useMutation((id: any) =>
    commentApi.delete(id)
  );

  return (
    <>
      <div className="comment">
        <div className="comment__avatar">
          <img
            src={
              item?.avatar ||
              "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
            }
            alt=""
          />
          {tierRef.current && tierRef.current > 1 && (
            <span className="comment__avatar-border"></span>
          )}
        </div>
        <div
          className="comment__content"
          onMouseLeave={() => {
            setShowAction(false);
            setShowPopup(false);
          }}
          onMouseOver={() => setShowAction(true)}
        >
          <div className="comment__content-username">
            {item?.fullname || ""}
          </div>
          <div className="comment__content-text">{item?.content || ""}</div>
        </div>
      </div>
      <div className="comment-info">
        {!showReply ? (
          <div className="comment__reply">
            <span onClick={() => handleToogle(item)}> Trả lời</span>
          </div>
        ) : (
          <div className="comment__reply">
            <span onClick={() => handleToogle(item)}> Ẩn trả lời</span>
          </div>
        )}
        <span className="comment-info__time">
          {moment(item?.created_at || "").fromNow()}
        </span>

        <Spin
          size="small"
          style={{ margin: "0 8px" }}
          spinning={mutation_delete_comment.isLoading}
        >
          {mutation_delete_comment.isLoading ? (
            ""
          ) : (
            <Popover
              className="w-130"
              placement="topLeft"
              title={"Hành động"}
              content={
                <div style={{ cursor: "pointer", width: "130px" }}>
                  <Tooltip placement="top" title={"Xóa bình luận"}>
                    <DeleteOutlined onClick={() => handleDeleComment(item)} />
                  </Tooltip>
                </div>
              }
              trigger="click"
            >
              {item?.id_user == currentUser?.id_user && (
                <span
                  className={`comment-info__action ${
                    showAction ? "active" : ""
                  }`}
                >
                  <DashOutlined />
                </span>
              )}
            </Popover>
          )}
        </Spin>
      </div>
      {showReply && (
        <div className="comment__reply-form">
          <Input
            ref={inputRef}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleReply(item);
              }
            }}
            onChange={(e) => setReplyValue(e.target.value)}
            placeholder="Trả lời ..."
          ></Input>
        </div>
      )}
      {mutation_add_comment.isLoading && (
        <span className="main-color" style={{ margin: "8px 0 20px 63px " }}>
          {mutation_add_comment.isLoading && "Bình luận đang được tải lên..."}
        </span>
      )}
      <div style={{ margin: "16px 0" }}>
        {item?.replies && (
          <div
            className="sub-comment"
            style={{
              paddingLeft: `12px`,
              marginLeft: `${32}px`,
            }}
          >
            {item?.replies.map((item: any) => {
              return (
                <CommentItem
                  detailPost={detailPost}
                  idPost={idPost}
                  tier={tierRef.current + 1}
                  item={item}
                ></CommentItem>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentItem;
