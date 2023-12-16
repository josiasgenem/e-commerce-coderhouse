import * as env from "../config/environment.js";

export const info = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Coderhouse E-commerce",
            version: "1.0.0",
            description: "E-commerce API",
            contact: "Josías Genem"
        },
        servers: [
            {
                url: env.DOMAIN,
                description: 'Local Server'
            }
        ]
    },
    apis: [
        './src/docs/*.yml'
    ]
}