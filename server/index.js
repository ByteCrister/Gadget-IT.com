const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log("Database Config:", process.env.DB_HOST, process.env.DB_USER);
    console.log(`Server is running on - http://localhost:${PORT}`); // Log the port (for local development)
});