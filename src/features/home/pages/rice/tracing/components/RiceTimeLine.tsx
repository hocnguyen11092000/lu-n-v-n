import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import CustomTimeline, {
  CustomLastTimeLineItem,
  CustomTimeLineItem,
} from "../../../../../../components/time-line";
import { ITruyXuatNguonGoc } from "../../../../../../model/tracking-tracing";
import RiceDetail from "./RiceDetail";

interface Props {
  lohang?: ITruyXuatNguonGoc;
}

const RiceTimeLine = ({ lohang }: Props) => {
  const [isShowRiceDetail, setIsShowRiceDetail] = useState(false);

  const handleShowRiceDetail = (
    e: React.MouseEvent<HTMLDivElement>,
    id: number
  ) => {
    if (id === 2) {
      setIsShowRiceDetail((pre) => !pre);
    }
  };

  const render = (
    tenGiaoDich?: string,
    nguoiMua?: string,
    nguoiBan?: string,
    soLuong?: number,
    id?: number
  ) => {
    return (
      <Box
        onClick={(e) => handleShowRiceDetail(e, id || 0)}
        bgcolor="#40AA41"
        color="#ffffff"
        p={2}
        borderRadius={1}
        sx={{
          cursor: "pointer",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            zIndex: 10,
            width: 15,
            height: 15,
            transform: "rotate(45deg)",
            top: 3.5,
            left: -4,
            bgcolor: "#40AA41",
          },
        }}
      >
        <Typography fontWeight="bold" fontSize="18px">
          Tên giao dịch: {tenGiaoDich}
        </Typography>
        <Box my={1}>
          <Box component="span" fontSize="17px" fontWeight="bold">
            Người mua:{" "}
          </Box>
          <Box component="span" fontSize="17px">
            {nguoiMua}
          </Box>
        </Box>
        <Box my={1}>
          <Box component="span" fontSize="17px" fontWeight="bold">
            Người bán:{" "}
          </Box>
          <Box component="span" fontSize="17px">
            {nguoiBan}
          </Box>
        </Box>
        <Box my={1}>
          <Box component="span" fontSize="17px" fontWeight="bold">
            Số lượng:{" "}
          </Box>
          <Box component="span" fontSize="17px">
            {soLuong} kilogam
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Grid container mt={4} display="flex" justifyContent="space-between">
      <Grid item xs={12}>
        <CustomTimeline>
          <CustomTimeLineItem
            time={
              lohang?.giaodichmubanlua.updated_at &&
              new Date(lohang?.giaodichmubanlua.updated_at).toLocaleDateString()
            }
          >
            {render(
              lohang?.giaodichmubanlua.name_lohang,
              lohang?.giaodichmubanlua.name_thuonglai,
              lohang?.giaodichmubanlua.name_xavien,
              lohang?.giaodichmubanlua.soluong,
              2
            )}
          </CustomTimeLineItem>
          <RiceDetail isShow={isShowRiceDetail} nhatkyhoatdong={lohang?.giaodichmubanlua?.hoatdongnhatky}></RiceDetail>
          <CustomTimeLineItem
            time={
              lohang?.giaodichmubanluagiong.updated_at &&
              new Date(
                lohang?.giaodichmubanluagiong.updated_at
              ).toLocaleDateString()
            }
          >
            {render(
              "Giao dịch lúa giống " + lohang?.giaodichmubanluagiong.name_gionglua,
              lohang?.giaodichmubanluagiong.name_xavien,
              lohang?.giaodichmubanluagiong.nhacungcapvattu_name,
              lohang?.giaodichmubanluagiong.soluong,
              3
            )}
          </CustomTimeLineItem>
        </CustomTimeline>
      </Grid>
    </Grid>
  );
};

export default RiceTimeLine;
