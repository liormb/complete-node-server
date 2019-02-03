# complete-node-server
Complete Node Server Environment using MongoDB Database

## Installation
```
yarn && yarn start
```

## Environment
In the root folder, create an `.env` file with the following keys and assign your key's value to them:
- DB_USERNAME
- DB_PASSWORD
- SENDGRID_API_KEY
- STRIPE_TOKEN

## Database
The app is using MongoDB as the document database source.<br />
In mongoDB, you will need to setup a database with the name `shop` that contains the following collections:
- users
- sessions
- products
- orders

You can learn about the different collection's fields by checking the [model's setup](https://github.com/liormb/complete-node-server/tree/master/src/models) in the application `src` folder.

## Usage
This application allows a user to signup and start adding custom product.
Then, any logged in user can select items by adding them to the cart and checkout on them.

The app is using [stripe](https://stripe.com/) to process credit cards.<br />
For testing, you can use a test card like: `4242-4242-4242-4242` (Visa) or just grab one of [these](https://stripe.com/docs/testing) credit card numbers.
