const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on - http://localhost:${PORT}`);
});