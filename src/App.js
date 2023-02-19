import './App.css';
import { Calendar } from './components/Calendar/Calendar';

function App() {
    return (
        <div className="App">
            <Calendar date={new Date()} />
        </div>
    );
}

export default App;
