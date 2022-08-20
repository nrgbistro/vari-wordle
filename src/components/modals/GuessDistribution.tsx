import "chart.js/auto";
import { useState } from "react";
import { Chart } from "react-chartjs-2";
import { NUMBER_OF_TRIES } from "../../redux/slices/statisticsSlice";
import { useAppSelector } from "../../redux/store";

const GuessDistribution = () => {
	const word = useAppSelector((state) => state.word.correctWord.word);
	const guessDistribution = useAppSelector(
		(state) => state.statistics.guessDistribution
	);
	const [currentPage, setCurrentPage] = useState(word.length);

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
				<p className="mx-2">{number}</p>
			</button>
		);
	};

	const options = {
		indexAxis: "y" as const,
		elements: {
			bar: {
				borderWidth: 2,
				borderRadius: 50,
			},
		},
		scales: {
			y: { grid: { display: false } },
			x: { suggestedMax: 5 },
		},
		responsive: true,
		plugins: {
			legend: { display: false },
			title: {
				display: true,
				text: `${currentPage} Character Words`,
			},
			tooltip: { enabled: true },
		},
	};

	const generateLabels = (num: number) => {
		let ret = [];
		const length = NUMBER_OF_TRIES[num - 4];
		for (let i = 1; i <= length; i++) {
			ret.push("" + i);
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

	return (
		<div className="mx-10">
			<h2 className="w-full text-center">{"Guess Distribution"}</h2>
			<Chart type="bar" data={data} options={options} />
			<div className="flex flex-row justify-center gap-4 mt-3">
				{paginationData.map((num, i) => (
					<Paginator number={num} selected={num === currentPage} key={i} />
				))}
			</div>
		</div>
	);
};

export default GuessDistribution;
