import { createSlice } from "@reduxjs/toolkit";

interface StatsData {
	gamesPlayed: number;
	won: number;
	lost: number;
	streaking: boolean;
	currentStreak: number;
	maxStreak: number;
	guessDistribution: number[][];
}

const initialState: StatsData = {
	gamesPlayed: 0,
	won: 0,
	lost: 0,
	streaking: false,
	currentStreak: 0,
	maxStreak: 0,
	guessDistribution: [],
};

const StatisticsSlice = createSlice({
	name: "statistics",
	initialState,
	reducers: {
		incrementGamesPlayed: (state) => {
			state.gamesPlayed++;
		},
		incrementWon: (state) => {
			state.won++;
		},
		incrementLost: (state) => {
			state.lost++;
		},
		incrementStreak: (state) => {
			if (!state.streaking) state.currentStreak = 0;
			state.currentStreak++;
			if (state.currentStreak > state.maxStreak)
				state.maxStreak = state.currentStreak;
		},
		setStreaking: (state, { payload }) => {
			state.streaking = payload;
		},
	},
});

export const {
	incrementWon,
	incrementLost,
	incrementGamesPlayed,
	setStreaking,
	incrementStreak,
} = StatisticsSlice.actions;

export default StatisticsSlice.reducer;
