import Joi from 'joi';
import express from 'express'
var router = express.Router();

// dummy data
const todoList = [
    { id: 0, text: "This is the todo 0", status: false },
    { id: 1, text: "This is the todo 1", status: true },
    { id: 2, text: "This is the todo 2", status: false },
    { id: 3, text: "This is the todo 3", status: false },
    { id: 4, text: "This is the todo 4", status: true },
    { id: 5, text: "This is the todo 5", status: false },
    { id: 6, text: "This is the todo 6", status: false },
];

// get request for todo
router.get("/", (req, res) => {
    res.send(todoList);
});

router.get("/:id", (req, res) => {
    const todoID = parseInt(req.params.id);
    const todoObject = todoList.find((todo) => todo.id === todoID);
    if (!todoObject) return res.status(404).send("404 not found");
    res.send(todoObject);
});

// post request for todo
router.post("/", (req, res) => {
    const { text } = req.body;

    // validate the request body
    const reqBodyValidation = bodyValidation(req.body);
    // catching bad request
    if (reqBodyValidation.error)
        return res.status(400).send(reqBodyValidation.error.details[0].message);

    const todo = {
        id: todoList.length,
        text,
        status: false,
    };
    todoList.push(todo);
    res.send(todo);
});

// update todo in the database
router.put("/:id", (req, res) => {
    // looking for todo
    const todoID = parseInt(req.params.id);
    const todoObject = todoList.find((todo) => todo.id === todoID);
    if (!todoObject)
        return res.status(404).send("The todo object doesn't exist");

    // validate the request
    const reqBodyValidation = bodyValidation(req.body);
    if (reqBodyValidation.error) {
        res.status(400).send(reqBodyValidation.error.details[0].message);
    }

    // update the todo
    todoObject.text = req.body.text;
    res.send(todoObject);
});

// delete the todo from the database
router.delete("/:id", (req, res) => {
    // looking for todo
    const todoID = parseInt(req.params.id);
    const todoObject = todoList.find((todo) => todo.id === todoID);
    if (!todoObject)
        return res.status(404).send("The todo object doesn't exist");

    // find the index of the object to delete
    const todoIndex = todoList.indexOf(todoObject);
    todoList.splice(todoIndex, 1);

    res.send(todoObject);
});

// function for validating the request body
function bodyValidation(reqBody: Object) {
    const schema = Joi.object({
        text: Joi.string().required(),
    });

    return schema.validate(reqBody);
}

module.exports = router;
