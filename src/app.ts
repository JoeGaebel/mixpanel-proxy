import express, {Express} from "express";
import cors from 'cors';
import proxy from "express-http-proxy";

function createApp(): Express {
    const app = express();

    app.use(cors());

    app.use('/', proxy('https://api-js.mixpanel.com', {
        https: true,
    }));

    return app;
}

export default createApp;