import cors from 'cors';
import express from 'express';
import Keycloak from 'keycloak-connect';
import { createServer, Server } from 'node:http';
import { Socket } from 'node:net';
import winston, { createLogger, format, transports } from 'winston';
import { checkForFolders } from './tools/checkForFolders.js';
import { CreateWaitValue } from './tools/async.js';
import { createServerLogger } from './tools/createLogger.js';
export default class StargazeServer {
    public static async initServer(port: number = 3002, debugging?: { deactivateLogs?: boolean; deactivateReporting?: boolean }) {
        // Create the logger
        const logger = createServerLogger();
        const server = new StargazeServer(port, logger);
        await server.init();
        return server;
    }
    private openSocketsID: number = 0;
    private openSockets: {
        [name: string]: Socket;
    } = {};
    private app = express();
    private server: Server | undefined = undefined;
    private kcConfig = {
        realm: process.env.REACT_APP_REALM ? process.env.REACT_APP_REALM : '',
        'bearer-only': true,
        'auth-server-url': process.env.REACT_APP_TOKEN_URL ? process.env.REACT_APP_TOKEN_URL : '',
        'confidential-port': 0,
        'ssl-required': 'external',
        resource: 'Stargaze',
        realmPublicKey: process.env.KEYCLOAK_PUBLIC_KEY || '',
    };

    protected constructor(private port: number, private logger: winston.Logger) {
        this.logger.info('Created Stargaze Server logger');
        this.logger.info('Creating TribeServer');
    }

    private async init() {
        this.logger.info('Starting Server');
        checkForFolders(this.logger);
        const server = await this.startServer();
        this.server = server;
        return this;
    }

    private async startServer() {
        const allowList: string[] = [];
        const keycloak = new Keycloak({ store: undefined }, this.kcConfig);

        this.logger.info('Setting up Cors');
        //--------------------------------------------------------------------------------------------------------------------------------------
        this.app.use(
            cors((req, callback) => {
                let corsOptions: cors.CorsOptions;
                if (allowList.indexOf(req.header('Origin') || '') >= -1) {
                    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
                    corsOptions.credentials = true;
                } else {
                    this.logger.info('Cors Failed at', { origin: req.header('Origin') });
                    corsOptions = { origin: false }; // disable CORS for this request
                }
                callback(null, corsOptions); // callback expects two parameters: error and options
            })
        );

        this.app.use(keycloak.middleware());
        this.app.use(keycloak.protect('user'));
        this.logger.info('Creating httpServer');
        //--------------------------------------------------------------------------------------------------------------------------------------
        let promise = CreateWaitValue<void>();
        const httpServer = createServer(this.app).listen(this.port, async () => {
            this.logger.info('HTTP Server running on port ' + this.port);
            promise.solve();
        });
        httpServer.on('connection', (socket) => {
            const sockId = this.openSocketsID++;
            this.openSockets[sockId] = socket;
            socket.on('close', () => {
                delete this.openSockets[sockId];
            });
        });
        httpServer.on('error', (err) => {
            this.logger.error(err);
        });
        await promise.wait;
        return httpServer;
    }

    public async closeServer() {
        this.logger.info('Closing Server');
        for (let sock of Object.keys(this.openSockets).map((e) => this.openSockets[e])) {
            this.logger.info('Killing Sockets');
            setTimeout(() => {
                sock.destroy();
                this.logger.info('Killed');
            }, 1);
        }
        //--------------------------------------------------------------------------------------------------------------------------------------
        if (this.server) this.server.close(() => this.logger.info('Server closed'));
    }
}
