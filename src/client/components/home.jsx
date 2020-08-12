import React from "react";
import {Link} from 'react-router-dom';


export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: null,
            error: null,
            showWarning: true,
        };
    }

    componentDidMount() {
        this.fetchItems();

        if (this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }

    }

    async fetchItems() {

        const url = "/api/items";

        let response;
        let payload;

        try {
            response = await fetch(url);
            payload = await response.json();
        } catch (err) {
            this.setState({
                error: "ERROR when retrieving list of items: " + err,
                items: null
            });
            return;
        }

        if (response.status === 200) {
            this.setState({
                error: null,
                items: payload
            });
        } else {
            this.setState({
                error: "Issue with HTTP connection: status code " + response.status,
                items: null
            });
        }
    }

    deleteItem = async (id) => {

        const url = "/api/items/" + id;

        let response;

        try {
            response = await fetch(url, {method: "delete"});
        } catch (err) {
            alert("Delete operation failed: " + err);
            return false;
        }

        if (response.status !== 204) {
            alert("Delete operation failed: status code " + response.status);
            return false;
        }

        this.fetchItems();

        return true;
    };


    render() {

        const Sold = () => {
            const [showResults, setShowResults] = React.useState(false);
            const onClick = () => setShowResults(true);

            return (
                <div >
                    <input className="soldBanner" type="submit" value="Sell" onClick={onClick}/>
                    {showResults ? <div className="sold">
                        <div className="soldText">SOLD</div>
                    </div> : null}
                </div>
            )
        };

        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;

        let table;

        if (this.state.error !== null) {
            table = <p>{this.state.error}</p>
        } else if (this.state.items === null || this.state.items.length === 0) {
            table = <p>There are no items registered in the database</p>
        } else {
            table = <div>
                <table className="itemContainer">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Current Bid</th>
                        <th>Starting Price</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.items.map(i =>
                        <tr key={"key_" + i.id} className="singleItemContainer">
                            <td>{i.name}</td>
                            <td>{i.description}</td>
                            <td>{i.currentBid}</td>
                            <td>{i.startingPrice}</td>
                            {loggedIn ? (
                                <div>
                                    <Sold/>
                                    <Link to={"/edit?bookId=" + i.id}>
                                        <button className="btn">
                                            <i className="fas fa-comments-dollar"/>
                                        </button>
                                    </Link>
                                    <button className="btn" onClick={_ => this.deleteItem(i.id)}>
                                        <i className="far fa-trash-alt"/>
                                    </button>

                                </div>
                            ) : (
                                <td>Please login to enable these options</td>
                            )}
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        }

        return (

            <div>

                <h2>Auction House</h2>
                {table}
                {loggedIn ? (
                    <div>
                        <Link to={"/create"}>
                            <button className="btn">New item</button>
                        </Link>
                    </div>

                ) : (
                    <p className="warningText">You need to login to create, bid and mark an item as sold!</p>
                )}
            </div>

        );
    }
}
