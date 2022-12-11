import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ILoHang } from "../../../../model/tracking-tracing";
import Card from "../../components/custom-cart/card";
import CustomPagination from "../../components/pagination/pagination";
import tracingApi from "../../../../api/tracing";
import { Divider, Input } from "antd";

const LohangPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(-1);
  const [data, setData] = useState<ILoHang[]>();

  const handleSearch = async () => {
    try {
      setLoading(-1);
      const response = await tracingApi.getLoHangWithoutHTX({
        search: searchValue,
      });
      if (response && response.data.length > 0) {
        setData(response.data);
        setLoading(1);
        setPageSize(response.meta.totalPage);
      } else {
        setLoading(0);
        setData([]);
        setPageSize(1);
      }
    } catch (error) {
      setLoading(0);
      console.log(error);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(-1);
        const response: any = await tracingApi.getLoHangWithoutHTX();
        if (response && response.data.length > 0) {
          setData(response.data);
          setLoading(1);
          setPageSize(response.meta.totalPage);
        } else {
          setLoading(0);
          setData([]);
          setPageSize(1);
        }
      } catch (error) {
        setLoading(0);
        console.log(error);
      }
    })();
  }, [page, limit]);

  return (
    <>
      <Box width="80%" m="30px auto">
        <Box height="60px" display="flex" alignItems="center">
          <FormControl>
            <Input
              onChange={handleInputChange}
              placeholder="Mã lô hàng"
              size="middle"
              style={{ borderRadius: "5px" }}
            />
          </FormControl>
          <Button
            variant="contained"
            color="success"
            sx={{ height: "30px", ml: "8px" }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Box>
        <Divider></Divider>
        <Grid container spacing={3}>
          {loading === -1 ? (
            <Grid textAlign="center" item xs={12}>
              <CircularProgress />
            </Grid>
          ) : loading === 0 ? (
            <Grid textAlign="center" item xs={12}>
              Không tìm thấy lô hàng
            </Grid>
          ) : (
            data?.map((htx, idx) => {
              return (
                <Grid item xs={4} key={htx.id_giaodichmuaban_lua}>
                  <Card
                    href={`/g/htx/lohang/${htx.id_giaodichmuaban_lua}`}
                    image={htx.img_lohang || "/images/bg-auth.webp"}
                  >
                    <Typography fontSize="18px">
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Mã số lô hàng:
                      </span>{" "}
                      {htx.id_giaodichmuaban_lua}
                    </Typography>
                    <Typography fontSize="18px">
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Tên lô hàng:
                      </span>{" "}
                      {htx.name_lohang}
                    </Typography>
                    <Typography fontSize="18px">
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Tên xã viên:
                      </span>{" "}
                      {htx.name_xavien}
                    </Typography>
                    <Typography fontSize="18px">
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Tên thương lái:
                      </span>{" "}
                      {htx.name_thuonglai}
                    </Typography>
                    <Typography fontSize="18px">
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Sản lượng:
                      </span>{" "}
                      {htx.soluong} kilogam
                    </Typography>
                    <Typography fontSize="18px">
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                        Ngày xuất:
                      </span>{" "}
                      {new Date(htx.updated_at).toLocaleDateString()}
                    </Typography>
                  </Card>
                </Grid>
              );
            })
          )}
          <Grid item xs>
            <Box minWidth={250} maxWidth={305}></Box>
          </Grid>
          <Grid item xs>
            <Box minWidth={250} maxWidth={305}></Box>
          </Grid>
          <Grid item xs>
            <Box minWidth={250} maxWidth={305}></Box>
          </Grid>
        </Grid>
        <Box width="100%" display="flex" justifyContent="center" my={3}>
          <CustomPagination
            page={page}
            setPage={setPage}
            limit={limit}
            pageSize={pageSize}
          ></CustomPagination>
        </Box>
      </Box>
    </>
  );
};

export default LohangPage;
