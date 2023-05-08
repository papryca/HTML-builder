const fsPromises = require('fs/promises');
const path = require('path');

const pathFileCopy = path.join(__dirname, 'files-copy');
const pathFileFirst = path.join(__dirname, 'files');

async function copyDirectory(oldWay, newWay) {
    await fsPromises.rm(newWay, {recursive: true, force: true});
    await fsPromises.mkdir(newWay, {recursive: true});

    fsPromises.readdir(oldWay, {withFileTypes: true}).then((files) => {
        files.forEach(async (file) => {
            const oldDirectory = path.join(oldWay, file.name);
            const newDirectory = path.join(newWay, file.name);
            if (file.isDirectory()) {
                await copyDirectory(oldDirectory, newDirectory);
            } else {
                await fsPromises.copyFile(oldDirectory, newDirectory);
            }
        });
    });
}


copyDirectory(pathFileFirst, pathFileCopy).then();
