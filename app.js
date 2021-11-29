// Project Setup
const axios = require('axios');
const base64 = require('base-64');
const express = require('express');
const app = express();
const path = require('path');
const AppError = require('./AppError');



app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));


// Error Handling
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}


// Credentials - your access information goes here
const username = ''; // please include your username here
const password = ''; // please include your password here
const tok = `${username}:${password}`;
const hash = base64.encode(tok);
const Basic = 'Basic ' + hash;


// Urls
const url = 'https://zccticketschallenge.zendesk.com/api/v2/tickets';
const countUrl = url + '/count';
// const pageCount = 25;
// const pageUrl = url + `?page[size]=${pageCount}`;



let tickets = [];
let totalTicketsCount = 0;
let pageLinks = [];


const countTickets = async (req, res, next) => {

    await axios.get(countUrl, {
        headers: {
            'Authorization': Basic
        }
    }).then(function (response) {
        // console.log(response.data.count.value);
        totalTicketsCount = response.data.count.value;
    }).catch(function (error) {
        const status = error.response.status;
        const message = error.response.data.error;
        console.log(status + " " + message);
    });





};

const fetchTickets = async (urlString, req, res, next) => {

    await axios.get(urlString, {
        headers: {
            'Authorization': Basic
        }
    }).then(function (resp) {
        // console.log(res.data.tickets);
        // console.log(resp.data);
        tickets.push(...resp.data.tickets);

        if (resp.data.next_page !== null) {
            nextUrl = resp.data.next_page;
            fetchTickets(nextUrl);
        }
        // pageLinks.push(resp.data.links.prev);
        // pageLinks.push(resp.data.links.next);
        // console.log(resp.data.links.next);
        // console.log(tickets);
        // console.log(tickets.length);

    }).catch(function (error) {
        const status = error.response.status;
        const message = error.response.data.error;
        console.log(status + " " + message);
    });



};


// Fetch all the tickets at once.
wrapAsync(countTickets());
wrapAsync(fetchTickets(url));


app.get('/tickets/:page', (req, res) => {
    let perPage = 25;
    let page = parseInt(req.params.page) || 1
    let totalPages = Math.ceil(totalTicketsCount / perPage);

    let startIndex = (perPage * page) - perPage;
    let currTickets = tickets.slice(startIndex, startIndex + perPage);
    res.render('index', { currTickets, totalTicketsCount, perPage, page, totalPages });
});


app.get('/tickets/ticketsdetails/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const ticket = tickets.find(t => t.id === parseInt(id));
    // console.log(tickets[0].id === parseInt(id));
    if (!ticket) {
        throw new AppError('Ticket Not Found', 404);
    }
    // console.log(ticket);
    res.render('show', { ticket })
}));


app.get('/', (req, res) => {
    res.redirect('/tickets/1');
})


// Custom Error Handeling
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.render('error', { message })
});



app.listen(3000, () => {
    console.log("ON PORT 3000!")
})

