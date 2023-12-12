import './App.css';
import Rating from './components/Rating';
import Weather from './components/Weather';

function App() {
  return (
    <div>
      <h1>Widgets in React</h1>
      <h2>Rating Widget</h2>
      <Rating />
      <hr/>
      <h2>Weather Widget</h2>
      <Weather />
    </div>
  );
}

export default App;
