import { existsSync, promises } from 'node:fs';
import winston from 'winston';
export async function checkForFolders(logger: winston.Logger) {
    const neededFolders = ['./usage'];
    for (const folder of neededFolders) {
        try {
            if (!existsSync(folder)) await promises.mkdir(folder);
        } catch (e) {
            console.error('Missing folder');
            throw e;
        }
    }
}
