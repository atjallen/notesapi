import express from 'express';
let app = express();
let port = process.env.PORT || 3000;

app.listen(port);

console.log('Notes server started on port ' + port);
