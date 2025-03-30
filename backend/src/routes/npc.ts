import express from 'express';

export function createNPCRouter() {
    const router = express.Router();
    // NPC routes
    router.get('/npcs/factions', (req, res, next) => {});
    router.get('/npcs/relations', (req, res, next) => {});
    router.post('/npcs/:factionId/diplomatic-action', (req, res, next) => {});
    return router;
}
