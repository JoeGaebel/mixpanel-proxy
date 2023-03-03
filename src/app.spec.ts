import createApp from "./app";
import request from "supertest";
import {Express} from "express";
import {rest, RestRequest} from 'msw'
import {SetupServer, setupServer } from 'msw/node'


describe('App', () => {
    let app: Express;
    let mockServer: SetupServer;

    const ipAddress = "199.999.999.998"
    const expectedBody = "blablabla"

    beforeAll(async () => {
        app = createApp();

        let expectation = rest.post('https://api-js.mixpanel.com/track', async (req: RestRequest, res, ctx) => {
            expect(req.headers.get('X-Real-Ip')).toEqual(ipAddress);
            expect(req.headers.get('X-Forwarded-For')).toEqual(ipAddress);
            expect(req.headers.get('X-Forwarded-Host')).toEqual("mixpanel-proxy");

            expect(req.url.search).toEqual('?verbose=1&ip=1&_=1677819282855');

            const body = await req.text();
            expect(body).toEqual(expectedBody)

            return res(
                ctx.status(200),
                ctx.json({
                    error: null,
                    status: 1
                })
            )
        });

        mockServer = setupServer(expectation);

        await mockServer.listen({
            onUnhandledRequest: 'bypass',
        });
    })

    afterEach(() => mockServer.resetHandlers())


    afterAll(() => {
        mockServer.close();
    })

    it('proxies /track', async () => {
        await request(app)
            .post("/track/?verbose=1&ip=1&_=1677819282855")
            .set('x-forwarded-for', `${ipAddress},1.1.1.1,2.2.2.2.2`)
            .send(expectedBody)
            .expect(200, {error: null, status: 1});
    });
})
