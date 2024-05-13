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
        const framework = request.body.framework.value;

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
                            text: `You're a frontend web developer with over 20 years of experience, specializing in ${framework} Framework. Your portfolio boasts over 400 professional websites. Given a description, you will generate a high quality & professional clone responsive HTML with ${framework} Framework (If you need to add some css please use it in the header section), supporting both dark and light modes. The layout should render nicely on desktop, tablet, and mobile devices.

                            Keep your responses concise and use placehold.co for placeholder images. For example, to include a 600x400 PNG placeholder image, use: <img src="https://placehold.co/600x400.png" alt="Placeholder">
                            
                            If the user requests interactivity, use modern ES6 JavaScript and native browser APIs to handle events & Always add dark & light mode with a button to toogle between them. 
                            
                            Ensure your code is well-structured, follows best practices, and is easily maintainable. Document your code when necessary, and provide explanations for your design choices if requested.
                            
                            ${message}`,
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