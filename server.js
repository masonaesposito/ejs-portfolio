const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var profile = require('./profile')
var Mailchimp = require('mailchimp-api-v3')

var mailchimp = new Mailchimp('d2025c8fb7ffc18e59e795342dc13f3d-us19');



const app = express();
app.use('/profile', profile)
app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extented: true }))
app.use(express.static('dist'))

app.set('views', './views');

app.set('view engine', 'ejs');

var profile = require('./profile')
app.use('/profile', profile)

app.get('/', (req, res) => {
  const data = {
    person: {
      firstName: 'Mason',
      lastName: 'Esposito',
    }
  }
  res.render('index', data);
});

app.get('/contact', (req, res) => {
  res.render('contact');
});


app.post('/thanks', (req, res) => {
  console.log(req.body);

  mailchimp.post('/lists/e46297ad61/members', {
    email_address: req.body.email,
    status: 'subscribed'
  })
    .then((response) => {
      console.log('Terms from MailChimp API', res);
      res.render('thanks', { contact: req.body })
    }).catch(err => console.log(err));

  
});

app.listen(8080, () => {
  console.log('listening at http://localhost:8080');
});