import { createSlice } from "@reduxjs/toolkit";

interface StatsData {
	gamesPlayed: number;
	won: number;
	streaking: boolean;
	currentStreak: number;
	maxStreak: number;
	guessDistribution: number[][];
}
export const NUMBER_OF_TRIES = [6, 6, 7, 8, 9];

const generateInitialGuessDistribution = (): number[][] => {
	let ret = [];
	for (let i = 4; i <= 8; i++) {
		let temp = [];
		for (let j = 0; j < NUMBER_OF_TRIES[i - 4]; j++) {
			temp.push(0);
		}
		ret.push(temp);
	}
	return ret;
};

const initialState: StatsData = {
	gamesPlayed: 0,
	won: 0,
	streaking: false,
	currentStreak: 0,
	maxStreak: 0,
	guessDistribution: generateInitialGuessDistribution(),
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
		incrementStreak: (state) => {
			if (!state.streaking) state.currentStreak = 0;
			state.currentStreak++;
			if (state.currentStreak > state.maxStreak)
				state.maxStreak = state.currentStreak;
		},
		setStreaking: (state, { payload }) => {
			state.streaking = payload;
		},
		// Payload shape: [{wordLength}, {numberOfTries}]
		addGuess: (state, { payload }) => {
			if (state.guessDistribution.length === 0) {
				state.guessDistribution = generateInitialGuessDistribution();
			}
			state.guessDistribution[payload[0] - 4][payload[1]]++;
		},
	},
});

export const {
	incrementWon,
	incrementGamesPlayed,
	setStreaking,
	incrementStreak,
	addGuess,
} = StatisticsSlice.actions;

export default StatisticsSlice.reducer;
