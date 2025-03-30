import express from 'express';

export function createResourcesRouter() {
    const router = express.Router();
    // Resources
    router.get('/planets/:id/resources', (req, res, next) => {});
    router.post('/planets/:id/resources/collect', (req, res, next) => {});

    return router;
}
