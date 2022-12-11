import Input from "antd/lib/input/Input";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CommentItem from "../comment-item/CommentItem";
import "./comment.scss";
type Props = {
  data: any;
  tier?: any;
  idPost?: any;
  detailPost?: any;
};

const Comment = ({ detailPost, idPost, data, tier = 1 }: Props) => {
  const tierRef = useRef(tier);
  return (
    <>
      {data &&
        data?.length > 0 &&
        data?.map((item: any) => {
          // console.log(item?.replies);
          return (
            <>
              <div className="comment-wrapper">
                <CommentItem
                  detailPost={detailPost}
                  idPost={idPost}
                  tier={tierRef.current}
                  item={item}
                ></CommentItem>
                {/* <div className="comment">
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
                  <div className="comment__content">
                    <div className="comment__content-username">
                      {item?.fullname || ""}
                    </div>
                    <div className="comment__content-text">
                      {item?.content || ""}
                    </div>
                  </div>
                </div> */}
                {/* <div
                  className="comment__reply"
                  onClick={() => handleReply(item)}
                >
                  Trả lời
                </div>
                {showReply && (
                  <div className="comment__reply-form">
                    <Input placeholder="Trả lời ..."></Input>
                  </div>
                )} */}
              </div>
            </>
          );
        })}
    </>
  );
};

export default Comment;
