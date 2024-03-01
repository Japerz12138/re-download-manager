export const SettingsPage = () => {
    return (
        <div className="Settings">
            <body>
                <div class="container" style={{ 'margin-top': '24px' }}>
                    <div class="row">
                        <div class="col">
                            <div class="card" style={{ 'border-style': 'none' }}>
                                <div class="card-body text-start shadow" style={{ 'border-radius': '12px', 'border-top-left-radius': '-1px', 'opacity': '1', 'border-color': 'rgb(0,128,255)', 'margin-bottom': '18px' }}>
                                    <div class="row">
                                        <div class="col-xl-7">
                                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-stars" style={{ 'padding-right': '1px', 'padding-bottom': '0px', 'margin-bottom': '6px', 'margin-right': '6px' }}>
                                                <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"></path>
                                            </svg>Theme</h4>
                                            <h6 class="text-muted mb-2" style={{ 'margin-bottom': '-11px', 'margin-top': '-4px' }}>Change between dark mode, light mode or follow system settings.</h6>
                                        </div>
                                        <div class="col-xl-5" style={{ 'text-align': 'right', 'margin-top': '10px' }}>
                                            <div class="dropdown show m-auto" style={{ 'margin-top': '-13px', 'padding-top': '0px' }}><button class="btn btn-primary dropdown-toggle" aria-expanded="true" data-bs-toggle="dropdown" type="button" style={{ 'text-align': 'right', 'margin-right': '25px' }}>Follow System</button>
                                                <div class="dropdown-menu show" data-bs-popper="none"><a class="dropdown-item bg-secondary-subtle" href="#">Follow System</a><a class="dropdown-item" href="#">Light</a><a class="dropdown-item" href="#">Dark</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body text-start shadow" style={{ 'border-radius': '12px', 'border-top-left-radius': '-1px', 'opacity': '1', 'border-color': 'rgb(0,128,255)', 'margin-bottom': '18px' }}>
                                    <div class="row">
                                        <div class="col-xl-7">
                                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-files" style={{ 'padding-right': '1px', 'padding-bottom': '0px', 'margin-bottom': '6px', 'margin-right': '6px' }}>
                                                <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"></path>
                                            </svg>Download Thread</h4>
                                            <h6 class="text-muted mb-2" style={{ 'margin-bottom': '-11px', 'margin-top': '-4px' }}>Select the number of shards you want to split. Increasing threads may speed up downloads, or it may slow down your computer.</h6>
                                        </div>
                                        <div class="col-xl-5" style={{ 'text-align': 'right', 'margin-top': '10px' }}>
                                            <div class="dropdown show m-auto" style={{ 'margin-top': '-13px', 'padding-top': '0px' }}><button class="btn btn-primary dropdown-toggle" aria-expanded="true" data-bs-toggle="dropdown" type="button" style={{ 'text-align': 'right', 'margin-right': '25px' }}>Let System Decide</button>
                                                <div class="dropdown-menu show" data-bs-popper="none"><a class="dropdown-item bg-secondary-subtle" href="#">Let System Decide</a><a class="dropdown-item" href="#">2</a><a class="dropdown-item" href="#">4</a><a class="dropdown-item" href="#">8</a><a class="dropdown-item" href="#">16</a><a class="dropdown-item" href="#">32</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body text-start shadow" style={{ 'border-radius': '12px', 'border-top-left-radius': '-1px', 'opacity': '1', 'border-color': 'rgb(0,128,255)', 'margin-bottom': '18px' }}>
                                    <div class="row">
                                        <div class="col-xl-7">
                                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-speedometer" style={{ 'padding-right': '1px', 'padding-bottom': '0px', 'margin-bottom': '6px', 'margin-right': '6px' }}>
                                                <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z"></path>
                                                <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"></path>
                                            </svg>Speed Limit</h4>
                                            <h6 class="text-muted mb-2" style={{ 'margin-bottom': '-11px', 'margin-top': '-4px' }}>Limit the download speed of individual files. (Set "0" to disable this function)</h6>
                                        </div>
                                        <div class="col-xl-5" style={{ 'text-align': 'right', 'margin-top': '10px' }}><input type="text" style={{ 'padding-left': '0px', 'text-align': 'right' }} placeholder="0"/><small style={{ 'margin-left': '10px' }}>KB/s</small></div>
                                    </div>
                                </div>
                                <div class="row text-center">
                                    <div class="col"><button class="btn btn-primary" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-save-fill" style={{ 'margin-right': '10px' }}>
                                        <path d="M8.5 1.5A1.5 1.5 0 0 1 10 0h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h6c-.314.418-.5.937-.5 1.5v7.793L4.854 6.646a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l3.5-3.5a.5.5 0 0 0-.708-.708L8.5 9.293z"></path>
                                    </svg>Save</button></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <script src="assets/bootstrap/js/bootstrap.min.js"></script>
            </body>
        </div>
    );
}