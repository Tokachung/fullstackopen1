import NewNote from "./components/NewNote";
import Notes from "./components/Notes";
import VisibilityFilter from "./components/VisibilityFilter";
import { useEffect } from "react"; // Import useEffect to handle side effects
import { useDispatch } from "react-redux";
import { initializeNotes } from "./reducers/noteReducer";

const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(initializeNotes())
	}, [dispatch])

	return (
		<div>
			<NewNote />
      		<VisibilityFilter />
			<Notes />
		</div>
	);
};

export default App