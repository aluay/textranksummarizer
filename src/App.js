import "./App.css";
import Header from "./Components/Header/Header.js";
import OriginalText from "./Components/Summarizer/Summarizer.js";

function App() {
	return (
		<div className="App">
			<Header />
			<OriginalText />
		</div>
	);
}

export default App;
