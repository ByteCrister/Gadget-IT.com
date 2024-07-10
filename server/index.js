const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT1 || process.env.PORT2;

app.listen(PORT, ()=>{
    console.log(`Server is running on - http://localhost:${PORT}`);
});