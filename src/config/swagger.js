const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'ToolShare API',
        version: '1.0.0',
        description: 'API REST ToolShare'
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }]
}

module.exports = swaggerDefinition
