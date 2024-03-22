import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter();

const initialState = filtersAdapter.getInitialState({
  filtersLoadingStatus: "idle",
  activeFilter: "all",
});

export const fetchFilteredHeroes = createAsyncThunk("filters/fetchFilteredHeroes", async () => {
  const { request } = useHttp();
  return await request("http://localhost:3001/filters");
});

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    activeFilterChanged: (state, action) => {
      state.activeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilteredHeroes.pending, (state) => {
        state.filtersLoadingStatus = "loading";
      })
      .addCase(fetchFilteredHeroes.fulfilled, (state, action) => {
        state.filtersLoadingStatus = "idle";
        filtersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchFilteredHeroes.rejected, (state) => {
        state.filtersLoadingStatus = "error";
      })
      .addDefaultCase(() => {});
  },
});

export const { selectAll } = filtersAdapter.getSelectors((state) => state.filters);

const { reducer, actions } = filtersSlice;

export default reducer;

export const { activeFilterChanged } = actions;
