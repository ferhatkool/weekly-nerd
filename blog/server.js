import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import serveStatic from 'serve-static';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const app = new App();
var engine = new Liquid()

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid')
//console.log(process.env) // remove this after you've confirmed it is working

const __filename = fileURLToPath(import.meta.url); // Convert the URL of the current module to a file path
const __dirname = dirname(__filename); // Get the directory name of the current module


app
    .use(logger())
    //.use(serveStatic(path.join(__dirname, 'src')))
    .use(serveStatic(path.join(__dirname, 'src')))
    .use('/', sirv('dist/assets'))
    .listen(7000);
  

app.get('/', async (req, res) => {
    

    return res.send(renderTemplate('views/index.liquid', {title: 'Blog'}));
});

const renderTemplate = (template, data) => {
    return engine.renderFileSync(template, data)
}
