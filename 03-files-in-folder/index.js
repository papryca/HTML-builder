const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'secret-folder');
fs.readdir(pathFile, {withFileTypes: true}, (err, files) => {
    files.forEach((file) => {
        if (file.isFile()) {
            const fileType = path.extname(file.name);

            fs.stat(path.join(pathFile, file.name), (err, stats) => {
                const fileSize = (stats.size / 1024).toFixed(3);
                console.log(`${file.name} - ${fileType.replace('.', '')} - ${fileSize}kb`);
            });
        }
    });
});

