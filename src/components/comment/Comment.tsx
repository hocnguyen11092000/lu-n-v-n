import Input from "antd/lib/input/Input";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "./comment.scss";
type Props = {
  data: any;
  tier?: any;
};

const Comment = ({ data, tier = 1 }: Props) => {
  const [showReply, setShowReply] = useState(false);
  const tierRef = useRef(tier);

  const handleReply = (item: any) => {
    setShowReply(!showReply);
  };

  return (
    <>
      {data &&
        data?.length > 0 &&
        data?.map((item: any) => {
          // console.log(item?.replies);

          return (
            <>
              <div className="comment-wrapper">
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
                  <div className="comment__content">
                    <div className="comment__content-username">
                      {item?.fullname || ""}
                    </div>
                    <div className="comment__content-text">
                      {item?.content || ""}
                    </div>
                  </div>
                </div>
                <div
                  className="comment__reply"
                  onClick={() => handleReply(item)}
                >
                  Trả lời
                </div>
                {showReply && (
                  <div className="comment__reply-form">
                    <Input placeholder="Trả lời ..."></Input>
                  </div>
                )}
              </div>

              <div>
                {item?.replies && (
                  <div
                    className="sub-comment"
                    style={{
                      paddingLeft: `12px`,
                      marginLeft: `${tierRef.current * 24}px`,
                    }}
                  >
                    <Comment
                      tier={tierRef.current + 1}
                      data={item?.replies || []}
                    ></Comment>
                  </div>
                )}
              </div>
            </>
          );
        })}
    </>
  );
};

export default Comment;
