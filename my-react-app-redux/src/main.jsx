import ReactDOM from "react-dom/client";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import App from "./App";

import noteReducer from "./reducers/noteReducer";
import filterReducer, { filterChange } from "./reducers/filterReducer";
import { createNote } from "./reducers/noteReducer";

const reducer = combineReducers({
	notes: noteReducer,
	filter: filterReducer,
});

const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));
store.dispatch(filterChange("IMPORTANT"));
store.dispatch(
	createNote("combineReducers form one reducer from many simple reducers"),
);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<App />
	</Provider>,
);
