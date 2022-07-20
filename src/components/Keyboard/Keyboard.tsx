import { BsBackspace } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { removeLetter, typeLetter } from "../../redux/slices/wordSlice";
import Key from "./Key";
import KeyRow from "./KeyRow";

const Keyboard = () => {
	const dispatch = useDispatch();
	return (
		<div className="flex flex-col items-center gap-2 mt-auto mb-1 px-1">
			<KeyRow>
				<Key
					action={() => {
						dispatch(typeLetter("Q"));
					}}
				>
					Q
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("W"));
					}}
				>
					W
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("E"));
					}}
				>
					E
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("R"));
					}}
				>
					R
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("T"));
					}}
				>
					T
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("Y"));
					}}
				>
					Y
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("U"));
					}}
				>
					U
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("I"));
					}}
				>
					I
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("O"));
					}}
				>
					O
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("P"));
					}}
				>
					P
				</Key>
			</KeyRow>
			<KeyRow className="px-4">
				<Key
					action={() => {
						dispatch(typeLetter("A"));
					}}
				>
					A
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("S"));
					}}
				>
					S
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("D"));
					}}
				>
					D
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("F"));
					}}
				>
					F
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("G"));
					}}
				>
					G
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("H"));
					}}
				>
					H
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("J"));
					}}
				>
					J
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("K"));
					}}
				>
					K
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("L"));
					}}
				>
					L
				</Key>
			</KeyRow>
			<KeyRow>
				<Key
					action={() => {
						// dispatch(typeLetter("ENTER"));
					}}
				>
					ENTER
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("Z"));
					}}
				>
					Z
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("X"));
					}}
				>
					X
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("C"));
					}}
				>
					C
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("V"));
					}}
				>
					V
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("B"));
					}}
				>
					B
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("N"));
					}}
				>
					N
				</Key>
				<Key
					action={() => {
						dispatch(typeLetter("M"));
					}}
				>
					M
				</Key>
				<Key
					action={() => {
						dispatch(removeLetter());
					}}
				>
					<BsBackspace className="text-xl mx-4" />
				</Key>
			</KeyRow>
		</div>
	);
};

export default Keyboard;
