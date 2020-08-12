import React from "react";
import {Link, withRouter} from 'react-router-dom'

export class Item extends React.Component {

    constructor(props) {
        super(props);
        // if this.props.description is true, then return this.props.description, else return ""
        this.state = {
            name: this.props.name ? this.props.name : "",
            description: this.props.description ? this.props.description : "",
            currentBid: this.props.currentBid ? this.props.currentBid : ""
        };

        this.ok = this.props.ok ? this.props.ok : "Ok";
    }

     onFormSubmit = async (event) => {
        event.preventDefault();

        const completed = await this.props.okCallback(
            this.state.name,
            this.state.description,
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

    onYearChange = (event) => {
        this.setState({currentBid: event.target.value});
    };

    render() {

        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <div
                        placeholder={"Name of the Item"}
                        value={this.state.name}
                        onChange={this.onTitleChange}
                        className="bookInput"
                    />
                    <div
                        placeholder={"About this item"}
                        value={this.state.description}
                        onChange={this.onAuthorChange}
                        className="bookInput"
                    />

                    <div className="inputTitle">Bid:</div>
                    <input
                        placeholder={"Your bid"}
                        value={this.state.currentBid}
                        onChange={this.onYearChange}
                        className="bookInput"
                    />

                    <button type="submit" className={"btn"}>{this.ok}</button>
                    <Link to={"/"}><button className={"btn"}>Cancel</button></Link>
                </form>
            </div>
        );
    }
}


/*
    Needed, because otherwise this.props.history would be undefined
 */
export default withRouter(Item);
