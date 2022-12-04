import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IHTX } from "../../../../model/tracking-tracing";
import Card from "../../components/custom-cart/card";
import CustomPagination from "../../components/pagination/pagination";
import tracingApi from "../../../../api/tracing";
import { Input } from "antd";

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [limit, setLimit] = useState(10);
  const [seachValue, setSearchValue] = useState("");
  const [data, setData] = useState<IHTX[]>();
  const [loading, setLoading] = useState(-1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    (async () => {
      setLoading(-1);
      setTimeout(async () => {
        const response: any = await tracingApi.getAll({
          limit: limit,
          page: page,
          search: seachValue
        });
        if (response && response.data.length > 0) {
          setLoading(1);
          setData(response.data);
          setPageSize(response.meta.totalPage);
        } else {
          setData([]);
          setLoading(0);
        }
      }, 1000);
      try {
        setLoading(-1);
      } catch (error) {
        console.log(error);
        setLoading(0);
      }
    })();
  }

  useEffect(() => {
    (async () => {
      setLoading(-1);
      setTimeout(async () => {
        const response: any = await tracingApi.getAll({
          limit: limit,
          page: page,
        });
        if (response && response.data.length > 0) {
          setLoading(1);
          setData(response.data);
          setPageSize(response.meta.totalPage);
        } else {
          setData([]);
          setLoading(0);
        }
      }, 1000);
      try {
        setLoading(-1);
      } catch (error) {
        console.log(error);
        setLoading(0);
      }
    })();
  }, [page, limit]);

  return (
    <>
      <Box width="80%" m="30px auto">
        <Box height="60px" display="flex" alignItems='center'>
          <FormControl>
            <Input
              onChange={handleInputChange}
              placeholder="Hợp tác xã"
              size="middle"
              style={{ borderRadius: "5px" }}
            />
          </FormControl>
          <Button variant="contained" color='success' sx={{height: '30px', ml: '8px'}}  onClick={handleSearch}>Tìm kiếm</Button>
        </Box>
        <Divider></Divider>
        <Grid container mt={3} spacing={3}>
          {loading === -1 ? (
            <Grid textAlign="center" item xs={12}>
              <CircularProgress />
            </Grid>
          ) : loading === 0 ? (
            <Grid textAlign="center" item xs={12}>
              Không tìm thấy hợp tác xã
            </Grid>
          ) : (
            data?.map((htx, idx) => {
              return (
                <Grid item xs={4} key={htx.id_hoptacxa}>
                  <Card
                    href={`/g/htx/${htx.id_hoptacxa}?htx=${htx.name_hoptacxa}`}
                    image={htx.thumbnail || "/images/bg-auth.webp"}
                  >
                    <Box component="div">
                      <Typography
                        fontSize="20px"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        fontWeight="bold"
                      >
                        {htx.name_hoptacxa}
                      </Typography>
                      {htx.active === 1 ? (
                        <span
                          style={{
                            backgroundColor: "green",
                            display: "block",
                            width: "100px",
                            textAlign: "center",
                            height: "17px",
                            fontSize: "12px",
                            lineHeight: "17px",
                            color: "white",
                            borderRadius: "5px",
                          }}
                        >
                          Đang hoạt động
                        </span>
                      ) : (
                        <span
                          style={{
                            backgroundColor: "red",
                            display: "block",
                            width: "120px",
                            textAlign: "center",
                            height: "17px",
                            fontSize: "12px",
                            lineHeight: "17px",
                            color: "white",
                            borderRadius: "5px",
                          }}
                        >
                          Không hoạt động
                        </span>
                      )}
                    </Box>
                    <Typography
                      fontSize="16px"
                      display="flex"
                      alignItems="center"
                      mb="15px"
                    ></Typography>
                    <Typography fontSize="15px" mb="5px">
                      <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                        Địa chỉ:
                      </span>{" "}
                      {htx.address}
                    </Typography>
                    <Typography fontSize="15px" mb="5px">
                      <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                        Liên hệ:
                      </span>{" "}
                      {htx.phone_number}
                    </Typography>
                    <Typography fontSize="15px" align="justify">
                      <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                        Mô tả:
                      </span>{" "}
                      {htx.description}
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

export default ProductPage;
