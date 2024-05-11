const fs = require('fs');

const encodeImage = (imagePath) => {
    const image = fs.readFileSync(imagePath);
    const base64Image = Buffer.from(image).toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
};

module.exports = {
    encodeImage
};