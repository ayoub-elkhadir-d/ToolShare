function getRoot(req, res) {
    res.json({ message: 'API ToolShare prete', env: process.env.NODE_ENV })
}

module.exports = { getRoot }
