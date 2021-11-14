const express = require("express");

const app = express();
app.use(express.static(__dirname));
app.listen(4000, "localhost", ()=>console.log("Running at Port 4000"));