import React from "react";
import "./not-found.scss";
type Props = {};

const NotFound = (props: Props) => {
  return (
    <div className="not-found">
      <p className="not-found__text main-color font-bold">
        Xin lỗi, trang web này hiện không tồn tại, hoặc bạn chưa có quyền để
        truy cập trang web này!
      </p>
      <div className="not-found__image ">
        <img
          className="radius-6"
          style={{ width: "100%", height: "450px", objectFit: "cover" }}
          src="https://cdn.dribbble.com/users/33385/screenshots/4776151/media/c0e0da4512618d4bcb0215b21543efdc.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default NotFound;
