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
                <Skeleton style={{ textAlign: "left" }} />
                <br />
                <Skeleton style={{ textAlign: "left" }} />
              </>
            )}
            {!loading && (
              <ListNews
                search
                headerText="Kết quả tìm kiếm: "
                header={true}
                post={data}
                searchWords={searchWords}
              ></ListNews>
            )}

            {!loading && data?.length == 0 && (
              <div style={{ color: "#333", textAlign: "center" }}>
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResult;
