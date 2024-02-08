import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div class="field is-grouped">
          <p class="control">
            <button class="button">
              Active
            </button>
          </p>
          <p class="control">
            <button class="button is-ghost">
              Inactive
            </button>
          </p>
          <p class="control">
            <button class="button is-ghost">
              Settings
            </button>
          </p>
        </div>
      </header>
      <body className="body">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              Minecraft.zip
            </p>
            <button class="card-header-icon" aria-label="more options">
              <span class="icon">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </header>
          <div class="card-content">
            <div class="content">
              <nav class="level is-mobile">
                <div class="column">
                  <div class="columns is-mobile">

                    <div class="column">
                      <progress class="progress is-small is-info" value="15" max="100">
                        15%
                      </progress>
                    </div>
                    <div class="column level-right">
                      <p>15% (21.1 MB / 233 MB)</p>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
          <div class="buttons level-right">
            <button class="button is-info is-light">Start</button>
            <button class="button is-warning is-light">Pause</button>
            <button class="button is-danger is-light">Delete</button>
          </div>
        </div>
      </body>
    </div>
  );
}

export default App;
