// dependencies
import Joi from 'joi';
import express from 'express'

//  importing routes
const todoRoute = require("./routes/todo");

// express app
const app = express();
app.use(express.json());

// listen for request
const port = process.env.PORT || 8080;
app.listen(port);

// register view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect("/todo");
});

// register route
app.use("/todo", todoRoute);

// 404 status code
app.use((req, res) => {
    res.status(404).render("404");
});

// function for validating the request body
function bodyValidation(reqBody: Object) {
    const schema = Joi.object({
        text: Joi.string().required(),
    });

    return schema.validate(reqBody);
}
