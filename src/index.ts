import serverlessExpress from "@vendia/serverless-express";
import createApp from "./app";

exports.handler = serverlessExpress({ app: createApp() })