import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from './routes/api';
import configCors from './config/cors';
import connectToDataBase from './config/connectDb';
// import { Server } from 'socket.io';
// import { createServer } from 'node:http';
// import socketService from './middleware/SocketIO';
// import convertImg from './serivces/convertImg';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

//configCors
configCors(app);

//config view engine
configViewEngine(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))

// parse application/json
app.use(bodyParser.json({ limit: '100mb' }))

//cookie parse
app.use(cookieParser())

//init api routes
initApiRoutes(app);
//init web routes
initWebRoutes(app);


connectToDataBase();
// convertImg();
//socketService

app.use('/public', express.static('public'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(">>> Backend is running on the port = " + PORT);
});
