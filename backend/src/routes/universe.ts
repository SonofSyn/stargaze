import express from 'express';

export function createUniverseRouter() {
    const router = express.Router();
    // Universe navigation
    router.get('/universe/galaxies', (req, res, next) => {});
    router.get('/universe/galaxy/:id/systems', (req, res, next) => {});
    router.get('/universe/system/:id/planets', (req, res, next) => {});
    router.get('/universe/planet/:id', (req, res, next) => {});

    // Colonization
    router.post('/universe/colonize', (req, res, next) => {});
    router.post('/universe/abandon/:planetId', (req, res, next) => {});
    return router;
}
