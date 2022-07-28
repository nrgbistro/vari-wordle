import { createSlice } from "@reduxjs/toolkit";

interface StatsData {}

const initialState: StatsData = {};

const StatisticsSlice = createSlice({
	name: "statistics",
	initialState,
	reducers: {},
});

export default StatisticsSlice.reducer;
