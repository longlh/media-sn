const express = require('express');

const app = module.exports = express();

app.get('/', (req, res, next) => {
	res.send('Admin area');
});
