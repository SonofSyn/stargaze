import express from 'express';

export function createDefenseRouter() {
    const router = express.Router();
    // Defense
    router.get('/planets/:id/defense', (req, res, next) => {});
    router.post('/planets/:id/defense/build', (req, res, next) => {});

    return router;
}
