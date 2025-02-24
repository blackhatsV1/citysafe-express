const connection = require('./conn');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) =>{
    res.render('pages/landingpage');
})

app.get('/signup', (req, res) =>{
    res.render('pages/signup');
})

app.get('/login', (req, res) =>{
    res.render('pages/login');
})

app.post('/signup', (req, res) => {
    const newsignup = {
        fname: req.body.fname,
        lastname: req.body.lastname,
        address: req.body.address,
        contactnum: req.body.contactnum,
        password: req.body.password
    };    
    connection.query(`INSERT INTO users SET ?`,[newsignup], (err) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

app.post('/login', (req, res) => {
    const contactnum = req.body.contactnum;
    const password = req.body.password;

    const sql = `SELECT * FROM users WHERE contactnum = ? AND password = ?`;

    connection.query(sql, [contactnum, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.send("Error");
        }
        
        if (result.length > 0) {
            const sql = 'SELECT * FROM requesthelp'; 

            connection.query(sql, (err, requesthelp) => {
                if (err) {
                    console.error('Error:', err);
                    return res.send('Error');
                } 
                res.render('pages/index', { users: requesthelp });
            });
        } else {
            res.render('pages/login');
        }
    });
});


app.get('/homepage', (req, res) =>{
    const sql = 'SELECT * FROM requesthelp'; 

    connection.query(sql, (err, requesthelp) => {
        if (err) {
            console.error('Error:', err);
            return res.send('Error');
        } 
        res.render('pages/index', { users: requesthelp });
    });
})


app.get('/requesthelp', (req, res) =>{
    res.render('pages/requesthelp');
})

app.post('/postrequest', (req, res) => {
    const newrequest = {
        name: req.body.name,
        location: req.body.location,
        needs: req.body.needs
    };
    connection.query(`INSERT INTO requesthelp SET ?`,[newrequest], (err) => {
        if (err) throw err;
        res.redirect('/homepage');
    });
});

app.get('/sendhelp', (req, res) =>{
    res.render('pages/sendhelp');
})

app.get('/about', (req, res) =>{
    res.render('pages/about');
})

app.get('/aboutlanding', (req, res) =>{
    res.render('pages/aboutlanding');
})

app.get('/logout', (req, res) =>{
    res.render('pages/landingpage');
})

app.listen(5000, () =>{
    console.log('Server at 5000...')
})