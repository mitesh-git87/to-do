require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/DB/db')


;(async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log("server is listning on  3000");
        });
    } catch (err) {  
        console.error("Failed to start server (DB not connected).");
        process.exit(1);
    }
})(); 
