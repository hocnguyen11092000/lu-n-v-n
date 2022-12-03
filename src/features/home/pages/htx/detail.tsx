import {
  Autocomplete,
  Box,
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
import { IHTX, ILoHang } from "../../../../model/tracking-tracing";
import Card from "../../components/custom-cart/card";
import CustomPagination from "../../components/pagination/pagination";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import tracingApi from "../../../../api/tracing";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Divider, Input } from "antd";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

const HTXDeatailPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(-1);
  const [options, setOptions] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [data, setData] = useState<ILoHang[]>();

  const params = useParams();
  const [query] = useSearchParams();

  const handleChange = (e: React.SyntheticEvent<Element, Event>, data: any) => {
    setSearchValue(data.value);
  };

  const handleInputChange = async (
    e: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    const lichmuavu = await tracingApi.getLichMuaVu(params.id || "", {
      search: value,
    });
    if (lichmuavu && lichmuavu.data.length > 0) {
      const dataMapping = lichmuavu.data.map((d: any) => {
        return {
          value: d.id_lichmuavu,
          label: d.name_lichmuavu,
        };
      });
      setOptions(dataMapping);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(-1);
        const response: any = await tracingApi.getLohang(params.id || "", {
          limit: limit,
          page: page,
          lichmuavu: searchValue,
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
    })();
  }, [page, limit, searchValue]);

  return (
    <>
      <Box width="80%" m="30px auto">
        <Box height="40px">
          <FormControl>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              size="small"
              options={options}
              disableClearable
              isOptionEqualToValue={(option, data) =>
                option.label === data.label
              }
              onChange={handleChange}
              onInputChange={handleInputChange}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Mùa vụ" />}
            />
          </FormControl>
        </Box>
        <Divider></Divider>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography fontSize='24px' fontWeight='bold'>Hợp tác xã: {query.get('htx')}</Typography>
          </Grid>
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

export default HTXDeatailPage;
