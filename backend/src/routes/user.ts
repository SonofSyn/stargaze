import express from 'express';

export function createUserRouter() {
    const router = express.Router();
    // User routes
    router.get('/users/me', (req, res, next) => {});

    return router;
}
