const fsPromises = require('fs/promises');
const path = require('path');

const distDirectory = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const pathIndex = path.join(__dirname, 'project-dist', 'index.html');
const pathTemplate = path.join(__dirname, 'template.html');
const pathComponents = path.join(__dirname, 'components');
const pathStyle = path.join(__dirname, 'styles');
const distStyle = path.join(__dirname, 'project-dist', 'style.css');


(async function buildAssets() {
    let assetsDistFolder = path.join(distDirectory, 'assets');
    await fsPromises.rm(assetsDistFolder, {recursive: true, force: true});

    async function copyAssets(from, to) {
        await fsPromises.mkdir((to), {recursive: true});
        await fsPromises.readdir(from, {withFileTypes: true}).then((files) => {
            files.forEach(async (file) => {
                const fromPath = path.join(from, file.name);
                const toPath = path.join(to, file.name);
                if (file.isDirectory()) {
                    await copyAssets(fromPath, toPath);
                } else {
                    await fsPromises.copyFile(fromPath, toPath);
                }
            });
        });
    }

    async function copyHtml(from, to, components) {
        let data = await fsPromises.readFile(from);
        data = data.toString();

        let files = await fsPromises.readdir(components, {withFileTypes: true});

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.isFile() && path.extname(file.name) === '.html'){
                let content = await fsPromises.readFile(path.join(components, file.name));

                let tag = path.parse(file.name).name;
                tag = '{{' + tag + '}}';
                data = data.replace(tag, content.toString());
            }
        }

        await fsPromises.writeFile(to, data);
    }

    async function copyStyles(oldWay, newWay){
        let stylesCss = [];
        let files = await fsPromises.readdir (oldWay, {withFileTypes: true});

        for (let i = 0; i < files.length; i++){
            const file = files[i];

            if (file.isFile() && path.extname(file.name) === '.css') {
                let content = await fsPromises.readFile(path.join(oldWay, file.name));
                stylesCss.push(content);
            }
        }

        await fsPromises.writeFile(newWay, stylesCss.join('\n'));
    }


    await copyAssets(assetsFolder, assetsDistFolder);
    await copyHtml(pathTemplate, pathIndex, pathComponents);
    await copyStyles(pathStyle, distStyle);

})().then();
