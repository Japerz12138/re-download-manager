import logo from './logo.svg';
import './App.css';

const navstyle = {
  'border-radius': '18px',
  'border-top-left-radius': '0',
  'border-top-right-radius': '0',
};

function App() {
  return (
    <div className="App">
      <body>
        <nav class="navbar navbar-expand-md bg-primary shadow py-3" style={navstyle}>
          <div class="container"><a class="navbar-brand d-flex align-items-center" href="#"><span></span></a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navcol-1"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button><button class="btn btn-primary active" type="button" style={{'margin-right': '15px','border-radius': '39px'}}>Active</button><button class="btn btn-primary" type="button" style={{'border-radius': '30px'}}>History</button>
            <div class="collapse navbar-collapse" id="navcol-1">
              <ul class="navbar-nav me-auto">
                <li class="nav-item"></li>
                <li class="nav-item"></li>
                <li class="nav-item"><a class="nav-link" href="#"></a></li>
                {/* gear icon */}
              </ul><button class="btn btn-primary" type="button" style={{'border-radius': '54px','height': '50px','width': '50px'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-gear" style={{'font-size': '25px'}}>
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"></path>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"></path>
              </svg></button>
            </div>
          </div>
        </nav>
        <div class="container" style={{'margin-top': '16px'}}>
          <div class="row">
            <div class="col">
              <div class="card" style={{'border-style': 'none'}}>
                <div class="card-body text-start shadow" style={{'border-radius': '12px','border-top-left-radius': '-1px','opacity': '1','border-color': 'rgb(0,128,255)','margin-bottom': '18px'}}>
                  <div class="row">
                    <div class="col-md-8 col-lg-7"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-filetype-exe" style={{'font-size': '27px'}}>
                      <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM2.575 15.202H.785v-1.073H2.47v-.606H.785v-1.025h1.79v-.648H0v3.999h2.575zM6.31 11.85h-.893l-.823 1.439h-.036l-.832-1.439h-.931l1.227 1.983-1.239 2.016h.861l.853-1.415h.035l.85 1.415h.908l-1.254-1.992zm1.025 3.352h1.79v.647H6.548V11.85h2.576v.648h-1.79v1.025h1.684v.606H7.334v1.073Z"></path>
                    </svg>
                      <h4 style={{'margin-top': '-28px','padding-right': '0px', 'padding-left': '0px','margin-left': '35px','margin-right': '0px'}}>Minecraft 1.12.2 Modpack.zip</h4>
                      <h6 class="text-muted mb-2" style={{'font-size': '13px'}}>114.5 MB / 1.9198 GB (4.2 MB/s)</h6>
                    </div>
                    <div class="col text-end"><button class="btn btn-primary shadow" type="button" style={{'margin-right': '16px','height': '42px','border-radius': '28px','width': '42px'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-pause-fill text-center" style={{'font-size': '25px','margin-left': '-5px'}}>
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"></path>
                    </svg></button><button class="btn btn-danger shadow" type="button" style={{'border-radius': '33px','height': '42px','width': '42px','border-color': 'rgba(255,255,255,0)'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-x" style={{'font-size': '25px','margin-left': '-4px'}}>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                    </svg></button></div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="progress" style={{'border-radius': '68px'}}>
                        <div class="progress-bar progress-bar-striped progress-bar-animated" aria-valuenow="6" aria-valuemin="0" aria-valuemax="100" style={{'width': '6%'}}>6%</div>
                      </div>
                    </div>
                  </div>
                  <h6 class="text-end text-muted card-subtitle mb-2" style={{'font-size': '13px','margin-top': '6px','margin-bottom': '5px','padding-bottom': '0px'}}>ETA 00:49:23</h6>
                </div>
                <div class="card-body text-start shadow" style={{'border-radius': '12px','border-top-left-radius': '-1px','opacity': '1','border-color': 'rgb(0,128,255)','margin-bottom': '18px'}}>
                  <div class="row">
                    <div class="col-md-8 col-lg-7"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-filetype-pdf" style={{'font-size': '27px'}}>
                      <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"></path>
                    </svg>
                      <h4 style={{'margin-top': '-28px','padding-right': '0px','padding-left': '0px','margin-left': '35px','margin-right': '0px'}}>ITS_Ticket_Copy.pdf</h4>
                      <h6 class="text-muted mb-2" style={{'font-size': '13px'}}>2.4 MB / 3.8 MB (174 KB/s)</h6>
                    </div>
                    <div class="col text-end"><button class="btn btn-primary shadow" type="button" style={{'margin-right': '16px','height': '42px','border-radius': '28px','width': '42px'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-play-fill text-center" style={{'font-size': '25px','padding-right': '0px','margin-left': '-4px'}}>
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                    </svg></button><button class="btn btn-danger shadow" type="button" style={{'border-radius': '33px','height': '42px','width': '42px','border-color': 'rgba(255,255,255,0)'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-x" style={{'font-size': '25px','margin-left': '-4px'}}>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                    </svg></button></div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="progress" style={{'border-radius': '68px'}}>
                        <div class="progress-bar bg-secondary progress-bar-striped" aria-valuenow="63" aria-valuemin="0" aria-valuemax="100" style={{'width': '63%'}}>63%</div>
                      </div>
                    </div>
                  </div>
                  <h6 class="text-end text-muted card-subtitle mb-2" style={{'font-size': '13px','margin-top': '6px','margin-bottom': '5px','padding-bottom': '0px'}}>PAUSED - ETA 00:00:12</h6>
                </div>
                <div class="card-body text-start shadow" style={{'border-radius': '12px','border-top-left-radius': '-1px','opacity': '1','border-color': 'rgb(0,128,255)','margin-bottom': '18px'}}>
                  <div class="row">
                    <div class="col-md-8 col-lg-7"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-file-earmark-image" style={{'font-size': '27px'}}>
                      <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"></path>
                      <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z"></path>
                    </svg>
                      <h4 style={{'margin-top': '-28px','padding-right': '0px','padding-left': '0px','margin-left': '35px','margin-right': '0px'}}>Cool Pic.png&nbsp;</h4>
                      <h6 class="text-muted mb-2" style={{'font-size': '13px'}}>15.2 MB / 15.2 MB&nbsp;</h6>
                    </div>
                    <div class="col text-end"><button class="btn btn-primary shadow" type="button" style={{'margin-right': '16px','height': '42px','border-radius': '28px','width': '42px'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-pause-fill text-center" style={{'font-size': '25px','margin-left': '-5px'}}>
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"></path>
                    </svg></button><button class="btn btn-danger shadow" type="button" style={{'border-radius': '33px','height': '42px','width': '42px','border-color': 'rgba(255,255,255,0)'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-x" style={{'font-size': '25px','margin-left': '-4px'}}>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                    </svg></button></div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="progress" style={{'border-radius': '68px'}}>
                        <div class="progress-bar bg-success" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{'width': '100%'}}>100%</div>
                      </div>
                    </div>
                  </div>
                  <h6 class="text-end text-muted card-subtitle mb-2" style={{'font-size': '13px','margin-top': '6px','margin-bottom': '5px','padding-bottom': '0px'}}>DONE</h6>
                </div>
                <div class="card-body text-start shadow" style={{'border-radius': '12px','border-top-left-radius': '-1px','opacity': '1','border-color': 'rgb(0,128,255)','margin-bottom': '18px'}}>
                  <div class="row">
                    <div class="col-md-8 col-lg-7"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-file-earmark-image" style={{'font-size': '27px'}}>
                      <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"></path>
                      <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z"></path>
                    </svg>
                      <h4 style={{'margin-top': '-28px','padding-right': '0px','padding-left': '0px','margin-left': '35px','margin-right': '0px'}}>Not Cool Pic.png&nbsp;</h4>
                      <h6 class="text-muted mb-2" style={{'font-size': '13px'}}>2.2 MB / 3.0 MB&nbsp;</h6>
                    </div>
                    <div class="col text-end"><button class="btn btn-primary disabled shadow" type="button" style={{'margin-right': '16px','height': '42px','border-radius': '28px','width': '42px'}} disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-pause-fill text-center" style={{'font-size': '25px','margin-left': '-5px'}}>
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"></path>
                    </svg></button><button class="btn btn-danger shadow" type="button" style={{'border-radius': '33px','height': '42px','width': '42px','border-color': 'rgba(255,255,255,0)'}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-x" style={{'font-size': '25px','margin-left': '-4px'}}>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"></path>
                    </svg></button></div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div class="progress" style={{'border-radius': '68px'}}>
                        <div class="progress-bar bg-danger progress-bar-striped" aria-valuenow="73" aria-valuemin="0" aria-valuemax="100" style={{'width': '73%'}}>73%</div>
                      </div>
                    </div>
                  </div>
                  <h6 class="text-end text-muted card-subtitle mb-2" style={{'font-size': '13px','margin-top': '6px','margin-bottom': '5px','padding-bottom': '0px'}}>ERROR - Server returned 403</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <script src="styles/bootstrap/js/bootstrap.min.js"></script>
      </body>
    </div>

  );
}

export default App;
