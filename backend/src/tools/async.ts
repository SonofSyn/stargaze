import { pathToFileURL } from 'node:url';

/**
 * Returns a Promise, which is fullfilled if the Process should stop
 *
 * @export
 * @returns
 */
export function processStopSignaled() {
    let counter: {
        [name: string]: number;
    } = {};
    let _done: () => void;
    function down(sig: string) {
        console.log('*** Received Process Signal [' + sig + '] ***');
        if (counter[sig] == undefined) counter[sig] = 0;
        counter[sig]++;
        if (counter[sig] > 2) {
            console.log('*** Kill ...');
            return process.exit(-1);
        }
        if (counter[sig] > 1) return console.log('*** Process Already going down, hit again to exit process NOW!');
        if (_done !== undefined) return _done();
    }
    process.on('SIGINT', down.bind(null, 'SIGINT'));
    process.on('SIGTERM', down.bind(null, 'SIGTERM'));
    process.on('SIGBREAK', down.bind(null, 'SIGBREAK'));
    return new Promise<void>((res) => {
        _done = res;
    });
}

export interface IWaitValue<Type> {
    solve: (v: Type | undefined) => void;
    wait: Promise<Type | undefined>;
}

/**
 * An Object, someone can wait for and solve the Value someone else is waiting for
 *
 * @export
 * @template Type
 * @returns {IWaitValue<Type>}
 */
export function CreateWaitValue<Type>(): IWaitValue<Type> {
    let res: (v: Type | undefined) => void;
    let p = new Promise<Type | undefined>((r) => {
        res = r;
    });
    return {
        solve: res!,
        wait: p,
    };
}

export async function runIfMain(process: NodeJS.Process, import_meta: { url: string }, fnc: () => Promise<void>) {
    if (process.argv[1] == undefined) return; // Used if the program was started using -e (EVAL)!
    const n = pathToFileURL(process.argv[1]).href.toLowerCase();
    const p = import_meta.url.toLowerCase();
    if (n == p || n + '.js' == p) {
        try {
            await fnc();
        } catch (e) {
            console.log('Error on Executing fnc in runIfMain()', e);
            throw e;
        }
    }
}
