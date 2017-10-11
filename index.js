'use strict'
let express = require("express");
let app = express();

app.get("/test", function(req, res){
	res.status(200).send("Auto Commited From Bitbucket commit 1");
});

app.listen(3000);