import { createNote, toggleImportanceOf } from "./reducers/noteReducer";
import { useSelector, useDispatch } from "react-redux";
import NewNote from "./components/NewNote";
import Notes from "./components/Notes";

const App = () => {
	const filteredSelected = (value) => {
		console.log(value);
	};

	return (
		<div>
			<NewNote />

			<div>
				all
				<input
					type="radio"
					name="filter"
					onChange={() => {
						filteredSelected("ALL");
					}}
				/>
				important
				<input
					type="radio"
					name="filter"
					onChange={() => {
						filteredSelected("IMPORTANT");
					}}
				/>
				nonimportant
				<input
					type="radio"
					name="filter"
					onChange={() => {
						filteredSelected("NONIMPORTANT");
					}}
				/>
			</div>
			<Notes />
		</div>
	);
};

export default App;
