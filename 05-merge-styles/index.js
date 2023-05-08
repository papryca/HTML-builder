
const path = require('path');
const fsPromises = require('fs/promises');

const pathFile = path.join(__dirname, 'styles');
const bandleFile = path.join(__dirname,'project-dist', 'bundle.css');

let stylesCss = [];
async function copyStyles(oldWay, newWay){
    let files = await fsPromises.readdir (oldWay, {withFileTypes: true});

    for (let i = 0; i < files.length; i++){
        const file = files[i];

        if (file.isFile() && path.extname(file.name) === '.css') {
            let content = await fsPromises.readFile(path.join(pathFile, file.name));
            stylesCss.push(content);
        }
    }

    await fsPromises.writeFile(newWay, stylesCss.join('\n'));
}



copyStyles(pathFile, bandleFile).then();