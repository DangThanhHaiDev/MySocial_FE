import { Provider } from 'react-redux';
import './App.css';
import AppRouter from './Pages/Router/AppRouter';
import { store } from './GlobalState/store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </div>
  );
}

export default App;
