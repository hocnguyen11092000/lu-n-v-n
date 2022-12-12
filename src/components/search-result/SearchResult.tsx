import { Skeleton } from "antd";
import React from "react";
import ListNews from "../../features/home/components/news/list-news/ListNews";
import "./search-result.scss";
type Props = {
  bottom?: string;
  data: any;
  show: boolean;
  loading?: boolean;
  searchWords?: string;
};

const SearchResult = ({
  bottom,
  data = [],
  show = false,
  loading = false,
  searchWords,
}: Props) => {
  return (
    <>
      {show && (
        <div style={bottom ? { bottom: bottom } : {}} className="search-result">
          <div className="search-result__content">
            {loading && (
              <>
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    width: "100%",
                    gap: "20px",
                  }}
                >
                  <Skeleton.Image
                    active={true}
                    style={{ width: "150px" }}
                    className="radius-6"
                  />
                  <div>
                    <Skeleton.Button
                      active={true}
                      style={{
                        width: "250px",
                        height: "20px",
                        marginBottom: "12px",
                      }}
                      className="radius-6"
                    />

                    <Skeleton.Input
                      active={true}
                      style={{ width: "500px", height: "62px" }}
                      className="radius-6"
                    />
                  </div>
                </div>
                <br />
                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    width: "100%",
                    gap: "20px",
                  }}
                >
                  <Skeleton.Image
                    active={true}
                    style={{ width: "150px" }}
                    className="radius-6"
                  />
                  <div>
                    <Skeleton.Button
                      active={true}
                      style={{
                        width: "250px",
                        height: "20px",
                        marginBottom: "12px",
                      }}
                      className="radius-6"
                    />

                    <Skeleton.Input
                      active={true}
                      style={{ width: "500px", height: "62px" }}
                      className="radius-6"
                    />
                  </div>
                </div>
              </>
            )}
            {!loading && data && (
              <ListNews
                search
                headerText={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    Kết quả tìm kiếm:{" "}
                    <span className="main-color search-count">
                      Tìm thấy <b>({data?.length})</b> kết quả
                    </span>
                  </div>
                }
                header={true}
                post={data}
                searchWords={searchWords}
              ></ListNews>
            )}

            {!loading && data && data?.length == 0 && (
              <div style={{ color: "#333", textAlign: "center" }}>
                Không tìm thấy kết quả
              </div>
            )}
            {!loading && !data && (
              <div style={{ color: "#333", textAlign: "center" }}>
                Vui lòng nhập từ khóa tìm kiếm
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResult;
