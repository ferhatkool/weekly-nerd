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
import { convertion } from './scripts/objectConvertion.js'

const envFile = dotenv.config({ path: 'port.env'})
var port = process.env.PORT

const app = new App();
var engine = new Liquid()

app.engine('liquid', engine.express());
app.set('views', './views');
app.set('view engine', 'liquid')

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
    console.log(convertion(subjects))
    return res.send(renderTemplate('views/index.liquid', {
        title: 'Blog',
        subjects: convertion(subjects),
        speakers: convertion(speakers),
        weeklyNerds: convertion(weeklyNerds),
    }));
});

app.get('/meesterproef', async (req, res) => {
    console.log(subjects["meesterproef"])
    return res.send(renderTemplate('views/meesterproef.liquid', {
        subject: subjects["meesterproef"],
        title: subjects["meesterproef"].name
}));
})

app.get('/:name', async (req, res) => {
    const url = req.params.name;
    console.log(url)
    console.log(subjects[url])

    if (subjects[url]) {
        return res.send(renderTemplate('views/subject.liquid', {
            subject: subjects[url],
            title: subjects[url].name
        }));
    } else if (speakers[url]) {
        return res.send(renderTemplate('views/speaker.liquid', {
            speaker: speakers[url],
            title: speakers[url].name
        }));
    } else if (weeklyNerds[url]) {
        return res.send(renderTemplate('views/weekly-nerd.liquid', {
            weeklyNerd: weeklyNerds[url],
            title: weeklyNerds[url].name
        }));
    } else {
        res.status(404).send(renderTemplate('views/index.liquid', {
            title: "error"
        }));
    }
});