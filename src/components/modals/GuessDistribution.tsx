import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import ChartAreaBorder from "../../chartjs-plugins/ChartAreaBorder";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { ErrorBoundary } from "react-error-boundary";
import { NUMBER_OF_TRIES } from "../../redux/slices/statisticsSlice";
import { useAppSelector } from "../../redux/store";
import useDarkMode from "use-dark-mode";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartAreaBorder
);

const GuessDistribution = () => {
	const word = useAppSelector((state) => state.word.correctWord.word);
	const guessDistribution = useAppSelector(
		(state) => state.statistics.guessDistribution
	);
	const [currentPage, setCurrentPage] = useState(word.length);
	const darkMode = useDarkMode();

	const Paginator = ({
		number,
		selected = false,
	}: {
		number: number;
		selected?: boolean;
	}) => {
		return (
			<button
				onClick={() => setCurrentPage(number)}
				className={
					"border-black dark:border-white border-2 rounded-md hoverscale " +
					(selected && "bg-correct-100")
				}
			>
				<p
					className={
						"mx-3 my-1 text-xl " + (selected && !darkMode.value && "text-white") // Set font to white if dark mode is off to improve font readability
					}
				>
					{number}
				</p>
			</button>
		);
	};

	const generateLabels = (num: number) => {
		let ret = [];
		const length = NUMBER_OF_TRIES[num - 4];
		for (let i = 1; i <= length; i++) {
			ret.push(i + " ");
		}
		return ret;
	};

	const labels = generateLabels(currentPage);

	const data = {
		labels,
		datasets: [
			{
				label: "Wins",
				data: guessDistribution[currentPage - 4],
			},
		],
	};

	const paginationData = [4, 5, 6, 7, 8];

	function ErrorFallback({
		error,
		resetErrorBoundary,
	}: {
		error: any;
		resetErrorBoundary: any;
	}) {
		return (
			<div role="alert">
				<p>Something went wrong:</p>
				<pre>{error.message}</pre>
				<button onClick={resetErrorBoundary}>Try again</button>
			</div>
		);
	}

	const textColorSelector = () => {
		return darkMode.value ? "white" : "black";
	};

	const gridColorSelector = () => {
		return darkMode.value ? "white" : "black";
	};

	const options = {
		indexAxis: "y" as const,
		datasets: {
			bar: {
				backgroundColor: "rgba(83, 141, 78, 1)",
				borderRadius: 25,
			},
		},
		scales: {
			y: {
				grid: { display: false },
				title: {
					display: true,
					text: "Number of Games",
					color: textColorSelector(),
				},
				ticks: {
					color: textColorSelector(),
				},
			},
			x: {
				grid: { color: gridColorSelector() },
				suggestedMax: 5,
				title: {
					display: true,
					text: "Number of Wins          ", // 10 spaces to align with the center
					color: textColorSelector(),
				},
				ticks: {
					color: textColorSelector(),
					stepSize: 1,
				},
			},
		},
		devicePixelRatio: 4,
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: `${currentPage} Character Words`,
				color: textColorSelector(),
			},
			chartAreaBorder: {
				borderColor: gridColorSelector(),
				borderWidth: 2,
			},
		},
	};

	return (
		<div className="flex flex-col gap-2 mx-2">
			<h2 className="w-full text-center text-2xl">Guess Distribution</h2>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div className="h-[30vh]">
					<Bar data={data} options={options} plugins={[ChartAreaBorder]} />
				</div>
			</ErrorBoundary>

			<div className="flex flex-row sm:justify-center justify-around gap-0 sm:gap-4">
				{paginationData.map((num, i) => (
					<Paginator number={num} selected={num === currentPage} key={i} />
				))}
			</div>
		</div>
	);
};

export default GuessDistribution;
