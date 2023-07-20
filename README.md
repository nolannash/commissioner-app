# Commissioner
--
A project by: Nolan Nash -- @nolannash
## Introduction - Main ReadMe page

Hello and welcome to my application/website/project, Comissioner. The  intention of this project was twofold, first it was intended to act as a demonstration of the development of my skills as a software developer. Secondly it was created with the intention of streamlining the complicated process of managing comissions as a commission based artist. I spoke with several commision based artists in my community to create the project and hope that as I implement further improvements it can act as a helpful tool.


## Installation and Usage
While my project (should be) fully deployed and accesible online, there are steps you need to take if you want to download and install my project.
### Backend configuration
The first step is to configure and set up your backend, this will done with flask. 

1. Fork and clone this project and install it in your local environment.
2. CD into the server folder and run `pipenv install`
3. Depening on how you like to run your application, you can either add the next part into your .env file or directly into the terminal.
   1. run `export FLASK_APP=app.py`
   2. run `export FLASK_RUN_PORT=5555`
4. Run `flask db init` , `flask db migrate` and `flask db upgrade` to create your database and tables.
   1. In a new terminal, running `flask run' will start your server
5. For any missing imports showing up as errors, be sure to run `pip install <module name>`
6. If you decide to include the mail feature and cloud storage be sure to set up your own account settings in the config.py file

### Updating the JWT Secret Key

1. run touch .env
2. run python -c 'import secrets; print(secrets.token_hex())' this will output a secret key to the terminal that you should copy into the next command
3. run echo `JWT_SECRET_KEY=<your-secret-key> >> .env`. when you start pipenv using pipenv shell, it will automatically load the key as an environment variable

### Frontend configuration

- In a new terminal cd into the client folder and run `npm install`
- In the same terminal `npm start`
  - any erors relating to missing modules can be solved by running `npm i`

## Important and Notable Features

### Backend Features

- Separate user and seller models
- Image uploading and fetching integration
- Full auth with cookies
- Full crud on multiple models
### Frontend Features

- SignUp or Login as either a Seller or a User
-  Different homepage for sellers vs Users or "guests"
-  Full authentication with the backend and cookies
-  Create and modify your account
-  Sellers are able to post an item, add commission questions and other information
   -  Commission questions are rendered as form coponents for customers and are required.
   -  All items have full CRUD availability
-  When a user places an order, the seller is able to view the order, item, customer responses and other order information.
-  From the homepage, a search page is available that allows searching for specific items or stores

## Other Information and Planned Updates

Extras:

Planned Updates:
- full integration of flask mail in front and backend
- User can favorite items and shops to recieve email updates about products
- order chat functionality
- full payment integration (with the cusomization options as well)
- re-style
- pageify integration
- "realease calendar" integration
- sellers can attach their store to a larger company
- with calendar integration allow for 'tattoo artist' creator type with booking calendar
