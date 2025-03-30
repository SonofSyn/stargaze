import express from 'express';

export function createInvasionRouter() {
    const router = express.Router();
    // Invasion routes
    router.post('/invasions/start', (req, res, next) => {});
    router.get('/invasions/active', (req, res, next) => {});
    router.post('/invasions/:id/advance-phase', (req, res, next) => {});
    router.post('/invasions/:id/extract-resources', (req, res, next) => {});
    router.post('/invasions/:id/abandon', (req, res, next) => {});
    return router;
}
