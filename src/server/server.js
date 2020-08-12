const {app} = require("./app");
const repository = require("./db/repository");

const port = process.env.PORT || 8080;

app.listen(port, () => {
    repository.initItems();
    console.log('Started server on port ' + port);
});

