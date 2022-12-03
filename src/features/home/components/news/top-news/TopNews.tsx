import { Col, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import "./top-news.scss";
type Props = {
  post?: any;
};

const TopNews = ({ post }: Props) => {
  const navigate = useNavigate();
  console.log(post);

  return (
    <div className="top-news">
      <div className="top-news-list">
        <Row gutter={24}>
          <Col lg={18} md={18} sm={24} xs={24}>
            <div
              style={{
                padding: "12px",
                boxShadow: "0px 7px 25px rgba(0 0 0 /8%)",
              }}
              className="top-news-list__item cursor-poiner radius-6"
              onClick={() =>
                navigate(`/g/post/${(post && post[0]?.id_post) || ""}`)
              }
            >
              <Row gutter={0}>
                <Col lg={16} md={16} sm={24} xs={24}>
                  <img
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                    src={post && post[0]?.image}
                    alt=""
                  />
                </Col>
                <Col
                  lg={8}
                  md={8}
                  sm={24}
                  xs={24}
                  style={{
                    background: "rgb(2245,245,245)",
                    padding: "16px",
                    height: "300px",
                    maxHeight: "300px",
                    overflow: "auto",
                  }}
                >
                  <div style={{ maxHeight: "140px", overflow: "hidden" }}>
                    <h2>{(post && post[0]?.title_post) || ""}</h2>
                  </div>
                  <span className="top-news-list__item-category">
                    Nông nghiệp 4.0
                  </span>
                  <p>{(post && post[0]?.short_description) || ""}</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg={6} md={6} sm={24} xs={24}>
            <div
              className="top-news-list__item cursor-poiner radius-6"
              style={{
                padding: "12px",
                boxShadow: "0px 7px 25px rgba(0 0 0 /8%)",
                height: "323px",
              }}
              onClick={() =>
                navigate(`/g/post/${(post && post[1]?.id_post) || ""}`)
              }
            >
              <div
                style={{
                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <Row gutter={12}>
                  <Col lg={24} md={24} sm={24} xs={24}>
                    <img
                      style={{
                        marginBottom: "8px",
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                      src={post && post[1]?.image}
                      alt=""
                    />
                  </Col>
                  <Col
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    style={{ overflow: "auto" }}
                  >
                    <div
                      style={{
                        maxHeight: "100px",
                        overflow: "hidden",
                      }}
                    >
                      <h3>{(post && post[1]?.title_post) || ""}</h3>
                    </div>
                    <span className="top-news-list__item-category">
                      {" "}
                      Nông nghiệp 4.0
                    </span>
                    <p>{(post && post[1]?.short_description) || ""}</p>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TopNews;
