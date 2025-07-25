import { useDispatch, useSelector } from "react-redux";
import { toggleImportanceOf } from "../reducers/noteReducer";

const Notes = () => {
	const dispatch = useDispatch();
	//const notes = useSelector((state) => state.notes);
	const notes = useSelector(state => {
		if (state.filter === 'ALL') {
			return state.notes
		}
		return state.filter === 'IMPORTANT' 
		? state.notes.filter(note => note.important)
		: state.notes.filter(note => !note.important)
	})
	
	const toggleImportance = (id) => {
		dispatch(toggleImportanceOf(id));
	};

	return (
		<ul>
			{notes.map((note) => (
				<li key={note.id} onClick={() => toggleImportance(note.id)}>
					{note.content}{" "}
					<strong>{note.important ? "important" : ""}</strong>
				</li>
			))}
		</ul>
	);
};

export default Notes;
