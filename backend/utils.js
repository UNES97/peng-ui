const fs = require('fs');

const encodeImage = (imagePath) => {
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
};

const removeSpaces = (text) => {
    return text.replace(/\s/g, '');
}

const extractCleanHTMLFromResponse = (response) => {
    if (!response || !response.choices || response.choices.length === 0) {
        return null;
    }

    const choice = response.choices[0];

    if (!choice || !choice.message || !choice.message.content) {
        return null;
    }

    const htmlContent = choice.message.content;

    const startIdx = htmlContent.indexOf("```html") + 7;
    const endIdx = htmlContent.lastIndexOf("```");

    return htmlContent.substring(startIdx, endIdx).trim();
}

module.exports = {
    encodeImage, removeSpaces, extractCleanHTMLFromResponse
};