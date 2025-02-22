const app = require('./app');
require('dotenv').config();

// const PORT = process.env.PORT; //For development
const PATH = process.env.BACKEND_URL;

app.listen(PATH, ()=>{
    // console.log(`Server is running on - http://localhost:${PORT}`);
    console.log(`Server is running on - :${PATH}`);
});