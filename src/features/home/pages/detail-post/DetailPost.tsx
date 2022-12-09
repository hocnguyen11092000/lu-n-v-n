import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./detail-post.scss";
import postApi from "../../../../api/post";
import { Input, Skeleton, Space } from "antd";
import avatar from "../../../../assets/images/avatar.jpg";
import commentApi from "../../../../api/comment";
import { getResponseMessage } from "../../../../utils/getResponseMessage";
import { getErrorMessage } from "../../../../utils/getErrorMessage";
import Comment from "../../../../components/comment/Comment";

type Props = {};

const HomeDetailPost = (props: Props) => {
  const [commentValue, setCommentValue] = useState("");

  const { id } = useParams();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const fetchDetailPost = () => postApi.getDetail(id);
  const detailPost = useQuery([`home/post/detail/${id}`], fetchDetailPost, {
    // refetchInterval(data, query) {
    //   console.log(data, query);
    //   return 1000;
    // },
  });

  const handleAddComment = () => {
    mutation_add_comment.mutate(
      {
        id_post: id || "",
        parent_id: null,
        image: null,
        content: commentValue,
      },
      {
        onSuccess: (data: any) => {
          getResponseMessage(data);
          setCommentValue("");
          detailPost.refetch();
        },
        onError: (err) => {
          getErrorMessage(err);
        },
      }
    );
  };

  const mutation_add_comment = useMutation((data: any) =>
    commentApi.create(data)
  );

  return (
    <>
      <div className="detail-post">
        {detailPost.isLoading ? (
          <div style={{ margin: "12px 0" }}>
            <Skeleton className="radius-6" active style={{ width: "80%" }} />
            <div>
              <Skeleton.Button
                className="radius-6"
                active
                size="large"
                style={{ width: "40vw", margin: "16px 0 16px 0" }}
              />
              <br />
            </div>
            <div>
              <Skeleton.Image
                className="radius-6"
                active
                style={{ width: "80vw", height: "400px" }}
              />
            </div>
            <br />
            <div>
              <Skeleton.Image
                className="radius-6"
                active
                style={{ width: "80vw" }}
              />
            </div>
          </div>
        ) : (
          <p
            dangerouslySetInnerHTML={{
              __html: detailPost?.data?.data?.post?.content,
            }}
          ></p>
        )}

        <div className="add-comment">
          <div className="add-comment__avatar">
            <img src={avatar} alt="" />
          </div>
          <div className="add-comment__form">
            <Input
              size="large"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              style={{
                border: "none",
                borderBottom: "1px solid #ccc",
                borderRadius: "0px !important",
                minWidth: "350px",
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleAddComment();
                }
              }}
              placeholder="Viết bình luận của bạn..."
            ></Input>
          </div>
        </div>
        {mutation_add_comment.isLoading && (
          <span className="main-color" style={{ margin: "8px 54px" }}>
            {mutation_add_comment.isLoading && "Bình luận đang được tải lên..."}
          </span>
        )}
        {detailPost.isLoading ? (
          <>
            <div style={{ marginTop: "-50px" }}>
              <Space>
                <Skeleton.Avatar
                  active={true}
                  size={"large"}
                  shape={"circle"}
                />
                <Skeleton.Button
                  active={true}
                  size={"large"}
                  shape={"square"}
                  style={{
                    width: "250px",
                    height: "100px",
                    marginTop: "50px",
                    borderRadius: "16px",
                  }}
                />
              </Space>
            </div>
            <br />
            <div>
              <Space align="start">
                <Skeleton.Avatar
                  active={true}
                  size={"large"}
                  shape={"circle"}
                />
                <Skeleton.Button
                  active={true}
                  size={"large"}
                  shape={"square"}
                  style={{
                    width: "250px",
                    height: "100px",
                    borderRadius: "16px",
                  }}
                />
              </Space>
            </div>
          </>
        ) : (
          <div className="list-comment">
            <Comment
              detailPost={detailPost}
              idPost={id || ""}
              data={detailPost?.data?.data?.list_comment}
            ></Comment>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeDetailPost;
