import React from "react";
import {Link, withRouter} from 'react-router-dom'

export class CreateItem extends React.Component {

    constructor(props) {
        super(props);
        // if this.props.description is true, then return this.props.description, else return ""
        this.state = {
            name: this.props.name ? this.props.name : "",
            description: this.props.description ? this.props.description : "",
            startingPrice: this.props.startingPrice ? this.props.startingPrice : "",
            currentBid: this.props.currentBid ? this.props.currentBid : ""
        };

        this.ok = this.props.ok ? this.props.ok : "Ok";
    }

    onFormSubmit = async (event) => {
        event.preventDefault();

        const completed = await this.props.okCallback(
            this.state.name,
            this.state.description,
            this.state.startingPrice,
            this.state.currentBid,
            this.props.bookId);

        if(completed) {
            this.props.history.push('/');
        } else {
            alert("Failed to create new Item")
        }
    };

    onAuthorChange = (event) => {
        this.setState({description: event.target.value});
    };

    onTitleChange = (event) => {
        this.setState({name: event.target.value});
    };

    onPriceChange = (event) => {
        this.setState({startingPrice: event.target.value});
    };

    onBidChange = (event) => {
        this.setState({currentBid: event.target.value});
    };


    render() {

        function myFunction() {
            document.getElementById("displayRegistered").innerHTML = "Item registered !";
        }

        return (

            <div>
                <form onSubmit={this.onFormSubmit}>
                    <div className="inputTitle">Name:</div>
                    <input
                        placeholder={"Name of this item"}
                        value={this.state.name}
                        onChange={this.onTitleChange}
                        className="itemInput"
                    />
                    <div className="inputTitle">Description:</div>
                    <input
                        placeholder={"About this item"}
                        value={this.state.description}
                        onChange={this.onAuthorChange}
                        className="itemInput"
                    />
                    <div
                        placeholder={"price"}
                        value={this.state.startingPrice}
                        onChange={this.onPriceChange}
                        className="itemInput"
                    />
                    <div className="inputTitle">Set price):</div>
                    <input
                        placeholder={"price"}
                        value={this.state.currentBid}
                        onChange={this.onBidChange}
                        className="itemInput"
                    />




                    <button type="submit" className={"btn"} onClick={myFunction}>{this.ok}</button>

                    <Link to={"/"}><button className={"btn"}>Back</button></Link>
                    <p id="displayRegistered"/>

                </form>
            </div>
        );
    }
}


/*
    Needed, because otherwise this.props.history would be undefined
 */
export default withRouter(CreateItem);
