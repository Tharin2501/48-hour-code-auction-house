import React from "react";
import Item from "./Item";

export class Edit extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            item: null,
            error: null
        };

        this.bookId = new URLSearchParams(window.location.search).get("bookId");

        if(this.bookId === null){
            this.state.error = "Unspecified item id";
        }
    }

    componentDidMount(){
        if(this.state.error === null) {
            this.fetchItem();
        }
    }

    async fetchItem(){

        const url = "/api/items/" + this.bookId;

        let response;
        let payload;

        try {
            response = await fetch(url);
            payload = await response.json();
        } catch (err) {
            //Network error: eg, wrong URL, no internet, etc.
            this.setState({
                error: "ERROR when retrieving item: " + err,
                item: null
            });
            return;
        }

        if (response.status === 200) {
            this.setState({
                error: null,
                item: payload
            });
        } else {
            this.setState({
                error: "Issue with HTTP connection: status code " + response.status,
                item: null
            });
        }
    }


    onOk = async (description, name, currentBid, id) => {

        const url = "/api/items/"+id;

        const payload = {id, description: description, name: name, currentBid: currentBid};

        let response;

        try {
            response = await fetch(url, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            return false;
        }

        return response.status === 204;
    };


    render(){

        if(this.state.error !== null){
            return(
                <div>
                    <p>Cannot edit book. {this.state.error}</p>
                </div>
            );
        }

        if(this.state.item === null){
            return(<p>Loading...</p>);
        }


        return(
            <div>
                <h3>Bid on this item</h3>
                <Item
                    description={this.state.item.description}
                    name={this.state.item.name}
                    currentBid={this.state.item.currentBid}
                    bookId={this.bookId}
                    ok={"Bid"}
                    okCallback={this.onOk}
                />
            </div>
        );
    }
}
