import React from "react";
import "./home-footer.scss";
type Props = {};

const HomeFooter = (props: Props) => {
  return (
    <div className="home-footer">
      <div className="home-footer__top-footer">
        <p>
          Địa chỉ: &nbsp;
          <span>
            Đại Học Cần Thơ Khu II, 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ
          </span>
        </p>
        <p>
          Email: <span className="main-color"> nongnghiepxanh@gmail.com</span>
        </p>
        <p>
          Hotline: <span className="main-color"> 0363935029</span>{" "}
        </p>
      </div>
      <div className="home-footer__copy-right">
        @ Nông Nghiệp Xanh - Nền tảng thương mại điện tử dành cho thị trường
        nông nghiệp Việt Nam
      </div>
    </div>
  );
};

export default HomeFooter;
