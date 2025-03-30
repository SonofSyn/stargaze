import express from 'express';

export function createEventsRouter() {
    const router = express.Router();
    // Events routes
    router.get('/events', (req, res, next) => {});
    router.post('/events/:id/mark-read', (req, res, next) => {});
    return router;
}
