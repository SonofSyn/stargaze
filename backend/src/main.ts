import { config } from 'dotenv';
import StargazeServer from './server.js';
import { processStopSignaled, runIfMain } from './tools/async.js';

export async function StartServer(port: number) {
    try {
        process.title = 'Web-Server';
        const server = await StargazeServer.initServer(port);
        await processStopSignaled();
        await server.closeServer();
    } catch (e) {
        console.error('Failed on Top Level', e);
        process.exit(1);
    }
}

await runIfMain(process, import.meta, async () => {
    config();
    try {
        const server = await StargazeServer.initServer(3002, {
            deactivateReporting: process.env.REPORTER_DEBUGGING === 'true' ? true : false,
            // deactivateLogs: process.env.REPORTER_DEBUGGING === 'true' ? true : false,
        });
        await processStopSignaled();
        await server.closeServer();
    } catch (e) {
        console.error('Failed on Top Level', e);
        process.exit(1);
    }
});
