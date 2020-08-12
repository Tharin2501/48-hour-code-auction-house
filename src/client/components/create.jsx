import React from "react";
import Book from "./Item";
import {CreateItem} from "./createItem";

export class Create extends React.Component {

    constructor(props) {
        super(props);
    }

    onOk = async (name, description, startingPrice, currentBid, bookId) => {

        const url = "/api/items";

        const payload = {name, description, startingPrice, currentBid};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            return false;
        }

        return response.status === 201;
    };


    render() {

        return (
            <div>
                <h3>Register a new Item to the Auction house</h3>
                <CreateItem
                    name={""}
                    description={""}
                    startingPrice={""}
                    currentBid={""}
                    ok={"Register"}
                    okCallback={this.onOk}
                />
            </div>
        );
    }
}
