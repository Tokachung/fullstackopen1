import NewNote from "./components/NewNote";
import Notes from "./components/Notes";
import VisibilityFilter from "./components/VisibilityFilter";
import { useEffect } from "react"; // Import useEffect to handle side effects
import { useDispatch } from "react-redux";
import noteService from "./services/notes";
import { setNotes } from "./reducers/noteReducer"; // Import the action to set notes

const App = () => {

	const dispatch = useDispatch()

	useEffect(() => {
		noteService.getAll().then(notes => dispatch(setNotes(notes)))
	}, [])

	return (
		<div>
			<NewNote />
      		<VisibilityFilter />
			<Notes />
		</div>
	);
};

export default App