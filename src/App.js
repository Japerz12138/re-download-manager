import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div class="field is-grouped">
          <p class="control">
            <button class="button is-rounded">
              Active
            </button>
          </p>
          <p class="control">
            <button class="button is-rounded">
              Inactive
            </button>
          </p>
          <p class="control">
            <button class="button is-rounded">
              Settings
            </button>
          </p>
        </div>
      </header>
      <body className="body">
        <div class="card">
          <div class="card-content">
            <div class="content">
              <progress class="progress is-primary" value="15" max="100">15%</progress>
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
