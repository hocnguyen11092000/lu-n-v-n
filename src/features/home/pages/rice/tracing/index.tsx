import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import tracingApi from "../../../../../api/tracing";
import { ITruyXuatNguonGoc } from "../../../../../model/tracking-tracing";
import RiceInformation from "./components/RiceInformation";
import RiceTimeLine from "./components/RiceTimeLine";

enum LoadingStatus {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

const TrackingPage = () => {
  const [data, setData] = useState<ITruyXuatNguonGoc>();
  const [loading, setLoading] = useState<LoadingStatus>(LoadingStatus.LOADING);
  const params = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await tracingApi.getChiTietLoHang(params.id || "");
        if (data.statusCode === 200) {
          setData(data.data);
          setLoading(LoadingStatus.SUCCESS);
          return;
        }
        setLoading(LoadingStatus.ERROR);
      } catch (error) {
        setLoading(LoadingStatus.ERROR);
      }
    })();
  }, []);

  return (
    <Box width="80%" m="0 auto">
      {loading === LoadingStatus.LOADING ? (
        <Box width="100%" display="flex" justifyContent="center" mt='150px'>
          <CircularProgress size={50} color="success" />
        </Box>
      ) : loading === LoadingStatus.ERROR ? (
        <Box width='100%' mt='120px' flexDirection='column' alignItems='center' display='flex' justifyContent='center'>
          <Box component='img' src='/images/error.png' width='170px'></Box>
          <Typography fontWeight='bold' fontSize='20px' mt='20px'>Thông tin chưa được cập nhật</Typography>
        </Box>
      ) : (
        <>
          <RiceInformation product={data?.giaodichmubanlua}></RiceInformation>
          <RiceTimeLine lohang={data}></RiceTimeLine>
        </>
      )}
    </Box>
  );
};

export default TrackingPage;
