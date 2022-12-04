import React from "react";
import { useSelector } from "react-redux";
import "./comment.scss";
type Props = {
  data: any;
};

const Comment = ({ data }: Props) => {
  // console.log(data);

  const user = useSelector((state: any) => state.user.user);
  return (
    <>
      {data &&
        data?.length > 0 &&
        data?.map((item: any) => {
          return (
            <div className="comment">
              <div className="comment__avatar">
                <img
                  src={
                    item?.avatar ||
                    "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
                  }
                  alt=""
                />
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
          );
        })}
    </>
  );
};

export default Comment;
