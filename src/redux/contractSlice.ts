import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchUser: undefined,
  dataContract: null,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    searchUser(state, action) {
      state.searchUser = action.payload;
    },
    setdataContract(state, action) {
      state.dataContract = action.payload;
    },
  },
});

//actions
export const { searchUser, setdataContract } = contractSlice.actions;

// reducer
export default contractSlice.reducer;
