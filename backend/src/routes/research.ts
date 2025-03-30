import express from 'express';

export function createResearchRouter() {
    const router = express.Router();
    // Research routes
    router.get('/research', (req, res, next) => {});
    router.post('/research/start', (req, res, next) => {});
    router.post('/research/:researchId/cancel', (req, res, next) => {});
    return router;
}
