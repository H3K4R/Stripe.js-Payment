const cors = require("cors")
const express = require("express")
const stripe = require("stripe")("sk_test_51HHAf6JiVtBLwWjvcWJLCBaUxcRkR30SnmBEela9LZRMDJ3c8RQIbgHp2gSwsIeUPlDf4hGzc0FMZyJDUn7B8guj005cpIiQcw")

const uuid = require("uuid")

const app = express();

//Middilewares
app.use(express.json())
app.use(cors())

//Routes
app.get("/", (req, res)=> {
    res.send("It works")
})
app.post("/payment", (req, res) => {
    const {product, token} = req.body;
    console.log("PRODUCT", product);
    console.log("PRICE", product.price);
    const idempotencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id

    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `purchase of ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err))

})


//Listen
app.listen(8282, () => console.log("Listening at 8282"))
