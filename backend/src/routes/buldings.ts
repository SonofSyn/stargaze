import express from 'express';

export function createBuildingsRouter() {
    const router = express.Router();
    // Buildings routes
    router.get('/planets/:id/buildings', (req, res, next) => {});
    router.post('/planets/:id/buildings/construct', (req, res, next) => {});
    router.post('/planets/:id/buildings/:buildingId/upgrade', (req, res, next) => {});
    router.post('/planets/:id/buildings/:buildingId/cancel', (req, res, next) => {});
    return router;
}
