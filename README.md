# Zendesk-OA
 Online Assessment for Zendesk

### Instructions:

## Set Up:
1. Clone this repository. 
![Clone Repo](https://shiba.meowshiba.com/wp-content/uploads/2021/02/kindle_mac_01_clone.png "Clone Repo")  
2. Navigate the Terminal to the cloned repository.
3. In your terminal, run `npm install`. Wait till the `node_modules` folder successully installed.

## Input Credentials:
1. open `app.js` in the cloned repository with any text editor you preferred.
2. change `username` and `password` in __line 26__ and __line 27__.
3. change `subdomain` in __line 34__ if necessary. The subdomain should expire before Nov, 30, 2021.

## Run Project:
1. In your terminal, run `node app.js` to start the local server.
2. In your browser, open `http://localhost:3000/tickets` to view all the __101__ tickets.

## Additional Notes:
1. If API is not available, a message along with a status code will display in the console and your terminal. In the meantime, the page will show 0 tickes available to show.
2. Client-side errors are handled simply through displaying the error on the page.
3. Tests have not yet been implemented in this project.