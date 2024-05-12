require('dotenv').config()
const fs = require('node:fs')

const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY
});
const { encodeImage, removeSpaces, extractCleanHTMLFromResponse } = require("../utils");

const main = async (request, reply) => {
    try {

        const reqFile = request.body.image;
        const message = request.body.message.value;

        if (!reqFile || !reqFile.file) {
            return reply.status(400).send({
                message: "No image file uploaded.",
                statusCode: 400
            });
        }

        if (!reqFile.mimetype.startsWith('image')) {
            return reply.status(400).send({
                message: "Only image files are accepted (JPG,JPEG & PNG).",
                statusCode: 400
            });
        }

        const fileName = `${Date.now()}_${removeSpaces(reqFile.filename)}`;
        const imagePath = `./uploads/${fileName}`;
        fs.writeFileSync(imagePath, await reqFile.toBuffer());
        
        const dataUrl = encodeImage(imagePath);

        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `You're a frontend web developer that specializes in tailwindcss with over 20 years of experience and a portfolio boasting over 400 professional websites. Given a description, generate HTML with tailwindcss. You should support both dark and light mode. It should render nicely on desktop, tablet, and mobile. Keep your responses concise. Use placehold.co for placeholder images. If the user asks for interactivity, use modern ES6 javascript and native browser apis to handle events.`,
                        },
                        {
                            type: 'text',
                            text: message,
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

        const extractedHTML = await extractCleanHTMLFromResponse(response);
        reply.status(200).send({
            data: extractedHTML,
            response: response,
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