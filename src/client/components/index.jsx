import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import {Home} from "./home";
import {Edit} from "./edit";
import {NotFound} from "./not_found";
import HeaderBar from "./headerbar";
import Login from "./login";
import SignUp from "./signup";
import {Create} from "./create";


class App extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            user: null,

        };
    }

    componentDidMount() {
        this.fetchAndUpdateUserInfo();
    }

    fetchAndUpdateUserInfo = async () => {

        const url = "/api/user";

        let response;

        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }

        // Each REST endpoint MUST handle authentication(401) and possibly authorization(403) checks
        if (response.status === 401) {
            //that is ok
            this.updateLoggedInUser(null);
            return;
        }

        if (response.status !== 200) {
            //TODO here could have some warning message in the page.
        } else {
            const payload = await response.json();
            this.updateLoggedInUser(payload);
        }
    };

    updateLoggedInUser = (user) => {
        this.setState({user: user});
    };

    render() {
        const id = this.state.user ? this.state.user.id : null;

        return(
            <BrowserRouter>
                <div>
                    <HeaderBar userId={id} updateLoggedInUser={this.updateLoggedInUser}/>
                    <Switch>
                        <Route exact path="/create"
                               render={props => <Create {...props}
                                                        user={this.state.user}
                                                        updateLoggedInUser={this.updateLoggedInUser}
                                                        fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                               />}/>
                        <Route exact path="/edit"
                               render={props => <Edit {...props}
                                                        user={this.state.user}
                                                        updateLoggedInUser={this.updateLoggedInUser}
                                                        fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                               />}/>
                        <Route exact path="/login"
                               render={props => <Login {...props}
                                                       fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path="/signup"
                               render={props => <SignUp {...props}
                                                        fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path="/"
                               render={props => <Home {...props}
                                                      user={this.state.user}

                                                      fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
