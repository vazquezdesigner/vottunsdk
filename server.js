const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const publicDirectoryPath = path.join(__dirname, '/public');

// Middleware para analizar el cuerpo de las solicitudes POST
app.use(express.urlencoded({ extended: true }));

// Sesión
app.use(cookieParser('secret')); // Configura cookieParser con una clave secreta

app.use(session({
    secret: 'C9Gn3Rr5fULm&h!V4u#2@Ks8oPqYeT1', // Clave secreta para firmar la sesión
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Configuración de la cookie de sesión
}));

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(publicDirectoryPath));
// Indica a Express que sirva archivos estáticos desde la carpeta "node_modules" (si se encuentra allí)
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));

// Ruta para manejar la solicitud de deploy
app.post('/deploy', (req, res) => {
    // Lógica para realizar el deploy usando Axios
    // Aquí iría tu código para realizar el deploy

    res.send('Deploy realizado correctamente');
});

app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl;
    next();
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { name, apiKey, appId } = req.body;

    // Validar las credenciales del usuario y establecer una cookie de sesión
    res.cookie('loggedIn', true, { signed: true, encrypt: true });
    res.cookie('name', name, { signed: true, encrypt: true });
    res.cookie('apiKey', apiKey, { signed: true, encrypt: true });
    res.cookie('appId', appId, { signed: true, encrypt: true });

    res.redirect('/'); // Redirigir de regreso a la página de inicio
});

// Ruta para renderizar la página de inicio
app.get('/', (req, res) => {
    const loggedIn = req.signedCookies.loggedIn;
    const name = req.signedCookies.name;
    const apiKey = req.signedCookies.apiKey;
    const appId = req.signedCookies.appId;

    res.render('index', { 
        title: 'Home',
        loggedIn: loggedIn,
        name: name,
        apiKey: apiKey,
        appId: appId
    });
});

// Ruta para el cierre de sesión
app.get('/logout', (req, res) => {
    req.session.destroy(); // Eliminar la sesión del usuario

    // Eliminar las cookies de sesión
    res.clearCookie('loggedIn');
    res.clearCookie('name');
    res.clearCookie('apiKey');
    res.clearCookie('appId');

    res.redirect('/'); // Redirigir de regreso a la página de inicio
});

// Rutas para otras páginas
app.get('/deploy', (req, res) => {
    const loggedIn = req.signedCookies.loggedIn;
    const name = req.signedCookies.name;
    const apiKey = req.signedCookies.apiKey;
    const appId = req.signedCookies.appId;  

    res.render('deploy', { title: 'Deploy',
        loggedIn: loggedIn,
        name: name,
        apiKey: apiKey,
        appId: appId
        
    });
});

app.get('/allowance', (req, res) => {
    const loggedIn = req.signedCookies.loggedIn;
    const name = req.signedCookies.name;
    const apiKey = req.signedCookies.apiKey;
    const appId = req.signedCookies.appId; 

    res.render('allowance', { title: 'Allowance',
        loggedIn: loggedIn,
        name: name,
        apiKey: apiKey,
        appId: appId
    });
});


app.get('/transfer', (req, res) => {
    const loggedIn = req.signedCookies.loggedIn;
    const name = req.signedCookies.name;
    const apiKey = req.signedCookies.apiKey;
    const appId = req.signedCookies.appId; 

    res.render('transfer', { title: 'Transfer',
        loggedIn: loggedIn,
        name: name,
        apiKey: apiKey,
        appId: appId
    });
});

app.get('/transferfrom', (req, res) => {
    const loggedIn = req.signedCookies.loggedIn;
    const name = req.signedCookies.name;
    const apiKey = req.signedCookies.apiKey;
    const appId = req.signedCookies.appId; 
        
    res.render('transferfrom', { title: 'TransferFrom',
        loggedIn: loggedIn,
        name: name,
        apiKey: apiKey,
        appId: appId
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
