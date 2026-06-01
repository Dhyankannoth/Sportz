require("dotenv").config();

const app = require("./src/app");
require("./src/db/postgres");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Postgress is connected on port : ${PORT}`);
});




