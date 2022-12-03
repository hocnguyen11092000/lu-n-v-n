import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import "./detail-post.scss";
import postApi from "../../../../api/post";
import { Skeleton } from "antd";

type Props = {};

const HomeDetailPost = (props: Props) => {
  const { id } = useParams();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const fetchDetailPost = () => postApi.getDetail(id);
  const detailPost = useQuery([`home/post/detail/${id}`], fetchDetailPost);

  return (
    <>
      <div className="detail-post">
        {detailPost.isLoading ? (
          <div style={{ margin: "12px 0" }}>
            <Skeleton active style={{ width: "80%" }} />
            <div>
              <Skeleton.Button
                active
                size="large"
                style={{ width: "40vw", margin: "16px 0 16px 0" }}
              />
              <br />
            </div>
            <div>
              <Skeleton.Image
                active
                style={{ width: "80vw", height: "400px" }}
              />
            </div>
            <br />
            <div>
              <Skeleton.Image active style={{ width: "80vw" }} />
            </div>
          </div>
        ) : (
          <p
            dangerouslySetInnerHTML={{
              __html: detailPost?.data?.data?.post?.content,
            }}
          ></p>
        )}
      </div>
    </>
  );
};

export default HomeDetailPost;
