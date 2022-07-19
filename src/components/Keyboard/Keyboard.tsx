import { BsBackspace } from "react-icons/bs";
import Key from "./Key";
import KeyRow from "./KeyRow";

const Keyboard = () => {
	return (
		<div className="flex flex-col items-center gap-2 mt-auto mb-1 sm:mx-2">
			<KeyRow>
				<Key
					action={() => {
						console.log("Q");
					}}
				>
					Q
				</Key>
				<Key
					action={() => {
						console.log("W");
					}}
				>
					W
				</Key>
				<Key
					action={() => {
						console.log("E");
					}}
				>
					E
				</Key>
				<Key
					action={() => {
						console.log("R");
					}}
				>
					R
				</Key>
				<Key
					action={() => {
						console.log("T");
					}}
				>
					T
				</Key>
				<Key
					action={() => {
						console.log("Y");
					}}
				>
					Y
				</Key>
				<Key
					action={() => {
						console.log("U");
					}}
				>
					U
				</Key>
				<Key
					action={() => {
						console.log("I");
					}}
				>
					I
				</Key>
				<Key
					action={() => {
						console.log("O");
					}}
				>
					O
				</Key>
				<Key
					action={() => {
						console.log("P");
					}}
				>
					P
				</Key>
			</KeyRow>
			<KeyRow className="px-4">
				<Key
					action={() => {
						console.log("A");
					}}
				>
					A
				</Key>
				<Key
					action={() => {
						console.log("S");
					}}
				>
					S
				</Key>
				<Key
					action={() => {
						console.log("D");
					}}
				>
					D
				</Key>
				<Key
					action={() => {
						console.log("F");
					}}
				>
					F
				</Key>
				<Key
					action={() => {
						console.log("G");
					}}
				>
					G
				</Key>
				<Key
					action={() => {
						console.log("H");
					}}
				>
					H
				</Key>
				<Key
					action={() => {
						console.log("J");
					}}
				>
					J
				</Key>
				<Key
					action={() => {
						console.log("K");
					}}
				>
					K
				</Key>
				<Key
					action={() => {
						console.log("L");
					}}
				>
					L
				</Key>
			</KeyRow>
			<KeyRow>
				<Key
					action={() => {
						console.log("ENTER");
					}}
				>
					ENTER
				</Key>
				<Key
					action={() => {
						console.log("Z");
					}}
				>
					Z
				</Key>
				<Key
					action={() => {
						console.log("X");
					}}
				>
					X
				</Key>
				<Key
					action={() => {
						console.log("C");
					}}
				>
					C
				</Key>
				<Key
					action={() => {
						console.log("V");
					}}
				>
					V
				</Key>
				<Key
					action={() => {
						console.log("B");
					}}
				>
					B
				</Key>
				<Key
					action={() => {
						console.log("N");
					}}
				>
					N
				</Key>
				<Key
					action={() => {
						console.log("M");
					}}
				>
					M
				</Key>
				<Key
					action={() => {
						console.log("delete");
					}}
				>
					<BsBackspace className="text-xl mx-4" />
				</Key>
			</KeyRow>
		</div>
	);
};

export default Keyboard;
