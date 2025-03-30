import express from 'express';

export function createFleetRouter() {
    const router = express.Router();
    // Fleet routes
    router.get('/planets/:id/fleet', (req, res, next) => {});
    router.post('/planets/:id/fleet/build', (req, res, next) => {});
    router.post('/planets/:id/fleet/mission', (req, res, next) => {});
    router.get('/fleet/missions', (req, res, next) => {});
    router.post('/fleet/missions/:id/cancel', (req, res, next) => {});
    return router;
}
