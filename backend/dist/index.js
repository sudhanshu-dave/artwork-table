"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.get('/api/artworks', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const response = await axios_1.default.get('https://api.artic.edu/api/v1/artworks', {
            params: { page, limit }
        });
        const artworks = response.data.data;
        const pagination = response.data.pagination;
        res.json({
            data: artworks,
            total: pagination.total,
        });
    }
    catch (error) {
        console.error('Error fetching artworks:', error);
        res.status(500).json({ error: 'Failed to fetch artworks' });
    }
});
app.listen(PORT, () => {
    console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
