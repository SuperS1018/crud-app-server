import mysql from 'mysql';
import * as dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    debug: true,
    connectionLimit: 10
});

export const handleDisconnect = () => {
                                                    // the old one cannot be reused.
    db.connect(function(err) {                 // The server is either down
        if(err) {                                   // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err.code);
            setTimeout(handleDisconnect, 2000);     // We introduce a delay before attempting to reconnect,
        }else{
            console.log('Connected to db!');
        }                                           // to avoid a hot loop, and to allow our node script to
    });                                             // process asynchronous requests in the meantime.
                                                    // If you're also serving http, display a 503 error.
    db.on('error', function(err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                       // lost due to either server restart, or a
        }else{
            throw err;
        }
    });
  }