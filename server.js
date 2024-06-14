import * as dotenv from '@tinyhttp/dotenv'
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import serveStatic from 'serve-static';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// back-end scripts
import { subjects, speakers, weeklyNerds } from './scripts/data.js'

const envFile = dotenv.config({ path: 'port.env'})
var port = process.env.PORT

const app = new App();
var engine = new Liquid()

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid')
//console.log(process.env) // remove this after you've confirmed it is working

const __filename = fileURLToPath(import.meta.url); // Convert the URL of the current module to a file path
const __dirname = dirname(__filename); // Get the directory name of the current module

const renderTemplate = (template, data) => {
    return engine.renderFileSync(template, data)
}

app
    .use(logger())
    .use(serveStatic(path.join(__dirname, 'src')))
    .engine('liquid', engine)
    .set('views', './views')
    .set('view engine', 'liquid')
    .listen(port, () => console.log('Server running on http://localhost:' + port));
  

app.get('/', async (req, res) => {
    return res.send(renderTemplate('views/index.liquid', {title: 'Blog'}));
});

app.get('/subjects/:name', async (req, res) => {
    const subjectName = req.params.name;
    const subject = subjects[subjectName];
    if (subject) {
        return res.send(renderTemplate('views/subject.liquid', {
            title: subject.name,
            subject
        }));
    } else {
        res.status(404).send('Subject not found');
    }
});

app.get('/speakers/:name', async (req, res) => {
    const speakerName = req.params.name;
    const speaker = speakers[speakerName];
    if (speaker) {
        return res.send(renderTemplate('views/speaker.liquid', {
            title: speaker.name,
            speaker
        }));
    } else {
        res.status(404).send('Speaker not found');
    }
});

app.get('/weekly-nerd/:name', async (req, res) => {
    const number = req.params.name;
    const weeklyNerd = weeklyNerds[number];
    if (weeklyNerd) {
        return res.send(renderTemplate('views/weekly-nerd.liquid', {
            title: weeklyNerd.name,
            weeklyNerd 
        }));
    } else {
        res.status(404).send('Weekly Nerd not found');
    }
});