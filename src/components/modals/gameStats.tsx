import { useAppSelector } from "../../redux/store";

const GameStats = () => {
	const { gamesPlayed, won, currentStreak, maxStreak } = useAppSelector(
		(state) => state.statistics
	);

	const data = [
		{
			data: gamesPlayed,
			text: "Played",
		},
		{
			data: ((won / gamesPlayed) * 100).toFixed(0),
			text: "Win %",
		},
		{
			data: currentStreak,
			text: "Current Streak",
		},
		{
			data: maxStreak,
			text: "Max Streak",
		},
	];

	const Item = ({ topField, name }: { topField: string; name: string }) => (
		<div className="flex flex-col h-fit w-14">
			<h2 className="text-4xl">{topField === "NaN" ? 0 : topField}</h2>
			<p className="text-sm leading-tight">{name}</p>
		</div>
	);

	return (
		<div className="flex flex-row w-full justify-center gap-6">
			{data.map(({ data, text }) => (
				<Item topField={data.toString()} name={text} />
			))}
		</div>
	);
};

export default GameStats;
