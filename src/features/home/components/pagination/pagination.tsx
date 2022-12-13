import { Pagination, Stack } from "@mui/material";
import React from "react";

interface Props {
  page: number;
  setPage: (num: number) => void;
  limit: number;
  pageSize: number;
}

const CustomPagination = (props: Props) => {
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    props.setPage(value);
  };

  return (
    <Stack mb={4}>
      <Pagination
        count={Math.round(props.pageSize)}
        page={props.page}
        onChange={handleChange}
      />
    </Stack>
  );
};

export default CustomPagination;
