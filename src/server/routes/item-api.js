const express = require('express');
const repository = require("../db/repository");
const router = express.Router();

router.get('/items', (req, res) => {

    const since = req.query["since"];

    if (since !== undefined && since !== null) {
        res.json(repository.getItemsByBid(since));
    } else {
        res.json(repository.getAllItems());
    }
});


router.get('/items/:id', (req, res) => {

    const item = repository.getSingleItem(req.params["id"]);

    if (item === undefined || item === null) {
        res.status(404);
        res.send()
    } else {
        res.json(item);
    }
});

router.delete('/items/:id', (req, res) => {

    const deleted = repository.deleteItem(req.params.id);

    if (deleted) {
        res.status(204);
    } else {
        res.status(404);
    }
    res.send();
});

router.post('/items', (req, res) => {

    const dto = req.body;
    const id = repository.createItem(dto.name, dto.description, dto.startingPrice, dto.currentBid);

    res.status(201);
    res.header("location", "/api/items/" + id);
    res.send();
});

router.put('/items/:id', (req, res) => {

    if (req.params.id !== req.body.id) {
        res.status(409);
        res.send();
        return;
    }

    const updated = repository.updateItem(req.body);

    if (updated) {
        res.status(204);
    } else {
        res.status(404);
    }
    res.send();
});

router.all('/api*', (req, res) => {
    res.status(404);
    res.send();
});

module.exports = router;
