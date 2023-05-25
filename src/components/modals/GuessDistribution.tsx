import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
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
	Legend
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
					"border-black dark:border-white border-2 rounded-md " +
					(selected && "bg-green-500")
				}
			>
				<p className="mx-3 my-1 text-xl">{number}</p>
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
				borderColor: "rgba(255, 255, 255, 0)",
				backgroundColor: "rgba(100, 200, 5, 0.9)",
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

	const options = {
		indexAxis: "y" as const,
		devicePixelRatio: 4,
		elements: {
			bar: {
				borderWidth: 2,
				borderRadius: 50,
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
				suggestedMax: 5,
				title: {
					display: true,
					text: "Number of Wins",
					color: textColorSelector(),
				},
				ticks: {
					color: textColorSelector(),
					stepSize: 1,
				},
			},
		},
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: `${currentPage} Character Words`,
				color: textColorSelector(),
			},
		},
	};

	return (
		<div className="mr-6 ml-4">
			<h2 className="w-full text-center">Guess Distribution</h2>
			<ErrorBoundary FallbackComponent={ErrorFallback}>
				<div className="h-[30vh]">
					<Bar data={data} options={options} />
				</div>
			</ErrorBoundary>

			<div className="flex flex-row justify-center gap-4 mt-3">
				{paginationData.map((num, i) => (
					<Paginator number={num} selected={num === currentPage} key={i} />
				))}
			</div>
		</div>
	);
};

export default GuessDistribution;
