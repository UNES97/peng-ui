require('dotenv').config()
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});
const { encodeImage } = require("../utils");
const uploadFolder = './uploads';

const main = async (req, reply) => {
    try {
        if (!req.files || !req.files.image) {
            return reply.status(400).send({
                message: "No image file uploaded.",
                statusCode: 400
            });
        }

        const imageFile = req.files.image;
        if (!imageFile.mimetype.startsWith('image')) {
            return reply.status(400).send({
                message: "Only image files are accepted (JPG,JPEG & PNG).",
                statusCode: 400
            });
        }

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder);
        }
        const fileName = `${Date.now()}_${imageFile.name}`;
        const imagePath = path.join(uploadFolder, fileName);
        await imageFile.mv(imagePath);

        const dataUrl = encodeImage(imagePath);
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `You're a frontend web developer that specializes in tailwindcss. Given a description, generate HTML with tailwindcss. You should support both dark and light mode. It should render nicely on desktop, tablet, and mobile. Keep your responses concise and just return HTML that would appear in the <body> no need for <head>. Use placehold.co for placeholder images. If the user asks for interactivity, use modern ES6 javascript and native browser apis to handle events.`,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: dataUrl,
                            },
                        },
                    ],
                },
            ],
            max_tokens: 4096,
            temperature: 0.5,
        })

        reply.status(200).send({
            data: response,
            statusCode: 200,
        });
    }
    catch (error) {
        reply.status(500).send({
            message: error.message || "An error occurred while processing the request.",
            statusCode: 500,
        });
    }
}


module.exports = {
    main
}