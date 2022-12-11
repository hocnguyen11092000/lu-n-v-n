import { EyeOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { useEffect, useRef } from "react";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import "./list-news.scss";
import moment from "moment";
import "moment/dist/locale/vi";

type Props = {
  post?: any;
  header?: boolean;
  headerText?: any;
  searchWords?: string;
  onLoadMore?: any;
  page?: any;
  search?: boolean;
};

const ListNews = ({
  post,
  header,
  headerText,
  searchWords = "",
  onLoadMore,
  page,
  search = false,
}: Props) => {
  const navigate = useNavigate();
  const first = useRef(false);

  moment.locale("vi");

  useEffect(() => {
    first.current = true;
  }, []);

  return (
    <div className="list-news">
      {header && headerText && (
        <h3
          className="list-news-heading"
          style={{ marginBottom: "16px", textAlign: "left" }}
        >
          {headerText ? headerText : " Tất cả bài viết"}
        </h3>
      )}
      {post &&
        post.length > 0 &&
        post.map((news: any, index: number) => {
          return (
            <div
              className={`news-item cursor-poiner ${
                search && index == post.length - 1 ? "m-b-0" : ""
              }`}
              onClick={() =>
                navigate(`/g/post/${(news && news?.id_post) || ""}`)
              }
            >
              <div className="news-item-img">
                <img src={news?.image || ""} alt="" />
              </div>
              <div className="news-item-content">
                <p className="news-item-content-title">
                  <Highlighter
                    highlightClassName="hight-light-text"
                    searchWords={searchWords?.split(" ")}
                    autoEscape={true}
                    textToHighlight={news?.title_post || ""}
                  />
                </p>
                <div className="news-item-content-time main-color">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <EyeOutlined />
                    <span style={{ marginTop: "2px" }}>
                      {" "}
                      {news?.view + "  lượt xem" || ""}
                    </span>
                  </div>
                </div>
                <p className="news-item-content-time">
                  {(news?.created_at && moment(news?.created_at).fromNow()) ||
                    ""}
                </p>
                <p>{news?.short_description || ""}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ListNews;
