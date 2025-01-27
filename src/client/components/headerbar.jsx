import React from "react"
import { Link, withRouter } from "react-router-dom";

/*
    This file is heavily inspired from
    https://github.com/arcuri82/web_development_and_api_design/blob/master/exercise-solutions/quiz-game/part-08/src/client/headerbar.jsx
 */
export class HeaderBar extends React.Component {

    constructor(props) {
        super(props);
    }

    doLogout = async () => {
        const url = "/api/logout";

        let response;

        try {
            response = await fetch(url, {method: "post"});
        } catch (err) {
            alert("Failed to connect to server " + err);
            return;
        }

        if (response.status !== 204) {
            alert("Error when connecting to server: status code " + response.status);
            return;
        }

        this.props.updateLoggedInUser(null);
        this.props.history.push("/");
    };

    renderLoggedIn(userId) {
        return(
            <React.Fragment>
                <p className="header-text">
                    Welcome {userId}
                </p>
                <button className="header-button" onClick={this.doLogout} id="logoutBtnId">
                    Logout
                </button>
            </React.Fragment>
        );
    }

    renderNotLoggedIn() {
        return(
            <React.Fragment>
                <p className="header-text">You are not logged in</p>
                <div className="action-buttons">
                    <Link className="header-button" to="/login" tabIndex="0">
                        LogIn
                    </Link>
                    <Link className="header-button" to="/signup" tabIndex="0">
                        SignUp
                    </Link>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const userId = this.props.userId;

        let content;
        if(!userId) {
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(userId);
        }


        return(
            <div className="header">
                <Link className="header-logo" to={"/"} tabIndex="0">
                    Back
                </Link>
                {content}
            </div>
        )
    }

}

export default withRouter(HeaderBar);
