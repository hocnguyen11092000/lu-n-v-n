import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Spin } from "antd";
import React, { useState } from "react";
import postApi from "../../../../api/post";
import HomePageHeader from "../../components/header/HomePageHeader";
import ListNews from "../../components/news/list-news/ListNews";
import TopNews from "../../components/news/top-news/TopNews";
import * as _ from "lodash";
import "./home-page.scss";

type Props = {};

const HomePage = (props: Props) => {
  // const fetchAllPost = () => postApi.getAll({});
  // const post: any = useQuery(["home/post/all"], fetchAllPost);
  const [page, setPage] = useState(1);

  const fetchAllPost = ({ pageParam = 1 }) => {
    return postApi.getAll({ page: pageParam, limit: 5 });
  };

  const postQuery = useInfiniteQuery<any>({
    queryKey: ["home/post/all"],
    queryFn: fetchAllPost,
    getNextPageParam: (lastPage, pages: any) => {
      if (pages.length >= pages[0]?.meta?.totalPage) {
        return null;
      } else {
        return pages.length + 1;
      }
    },
  });

  const handleLoadMorePost = () => {
    postQuery.fetchNextPage();
    setPage(page + 1);
  };

  return (
    <>
      <div className="home-page-container">
        <Spin spinning={false} style={{ minHeight: "85vh" }}>
          {postQuery.isLoading ? (
            <>
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <Skeleton.Image
                  className="radius-6"
                  active
                  style={{
                    width: "780px",
                    height: "300px",
                  }}
                />
                <div>
                  <Skeleton.Input
                    className="radius-6"
                    active={true}
                    size={"default"}
                    style={{
                      width: "250px",
                      height: "80px",
                      margin: "0 0 12px 12px",
                    }}
                  />

                  <Skeleton.Input
                    className="radius-6"
                    active={true}
                    size={"default"}
                    style={{
                      width: "250px",
                      height: "208px",
                      margin: "0 12px",
                    }}
                  />
                </div>
              </div>
              <div>
                <Skeleton.Input
                  className="radius-6"
                  active={true}
                  size={"default"}
                  style={{
                    width: "215px",
                    margin: "26px 0",
                  }}
                />
                <br />
              </div>
              <div>
                <Skeleton
                  className="radius-6"
                  active
                  style={{ width: "80%" }}
                />
                <br />
              </div>
              <div>
                <Skeleton
                  className="radius-6"
                  active
                  style={{ width: "80%" }}
                />
                <br />
              </div>
              {/* <div>
                <Skeleton active style={{ width: "80%" }} />
                <br />
              </div>
              <div>
                <Skeleton active style={{ width: "80%" }} />
                <br />
              </div> */}
            </>
          ) : (
            <>
              {postQuery?.data?.pages &&
                postQuery?.data?.pages.map((group: any, index: number) => {
                  return (
                    <>
                      {index == 0 && (
                        <>
                          <TopNews post={group?.data}></TopNews>
                          <br />
                        </>
                      )}
                      {index == 0 && (
                        <h3
                          className="list-news-heading"
                          style={{ marginBottom: "16px", textAlign: "left" }}
                        >
                          Tất cả bài viết
                        </h3>
                      )}
                      <ListNews
                        page={postQuery?.data?.pages?.length}
                        post={
                          index == 0 ? _.slice(group?.data, 2) : group?.data
                        }
                      ></ListNews>
                    </>
                  );
                  // group?.data?.map((post: any, index: number) => {

                  // });
                })}
              {/* <TopNews post={post?.data?.data.slice(0, 2)}></TopNews>
              <br />
              <ListNews post={post?.data?.data.slice(2)}></ListNews> */}
            </>
          )}
          {postQuery.hasNextPage && (
            <div style={{ textAlign: "center", margin: "40px 0 20px 0" }}>
              <Button type="primary" onClick={handleLoadMorePost}>
                {postQuery.isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
              </Button>
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default HomePage;
