import express, {Express, Request, Response} from "express";
import fetch from 'node-fetch';
import cors from 'cors';
import bodyParser from 'body-parser';

function createApp(): Express {
    const app = express();
    app.use(cors());
    app.use(bodyParser.text({type: '*/*'}));
    app.use(express.json());

    app.post('/track', async (request: Request, response: Response) => {
        // @ts-ignore
        const queryParams = new URLSearchParams(request.query);
        const requestHeaders = request.headers as HeadersInit;
        const userIp = Array.isArray(request.headers['x-forwarded-for']) ?
            request.headers['x-forwarded-for'][0] :
            request.headers['x-forwarded-for']!.split(',')[0];

        const mixpanelResponse = await fetch(`https://api-js.mixpanel.com/track/?${queryParams}`, {
            method: 'post',
            body: request.body,
            // @ts-ignore
            headers: {
                ...requestHeaders,
                "X-Real-IP": userIp,
                "x-forwarded-for": userIp,
                "X-Forwarded-Host": "mixpanel-proxy"
            } as unknown as Headers
        })

        const mixPanelBody = await mixpanelResponse.json();

        response
            .status(mixpanelResponse.status)
            .send(mixPanelBody);
    });

    return app;
}

export default createApp;