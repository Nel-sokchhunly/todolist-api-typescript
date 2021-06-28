import Joi from "joi";
import express from "express";
var router = express.Router();

import {
    addTodo,
    deleteTodoByID,
    getAllTodo,
    getTodoByID,
    updateTodo,
} from "../firebase/index";

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
router.get("/", async (req, res) => {
    const data = await getAllTodo();
    await res.send(data);
});

// get one todo by ID
router.get("/:id", async (req, res) => {
    const todoID = req.params.id;

    const data = await getTodoByID(todoID);
    res.send(data);
});

// post request for todo
router.post("/", async (req, res) => {
    const { title, description } = req.body;

    // validate the request body
    const reqBodyValidation = bodyValidation(req.body, "create");
    // catching bad request
    if (reqBodyValidation?.error)
        return res.status(400).send(reqBodyValidation.error.details[0].message);

    const todo = {
        title,
        description,
        status: false,
    };

    const newTodo = await addTodo(todo);

    res.send(newTodo);
});

// update todo in the database
router.put("/:id", async (req, res) => {
    // validate the request
    const reqBodyValidation = bodyValidation(req.body, "update");
    if (reqBodyValidation?.error) {
        res.status(400).send(reqBodyValidation.error.details[0].message);
    }

    const todoUpdate = {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    };

    // update the todo
    const updatedTodo = await updateTodo(todoUpdate);
    res.send(updatedTodo);
});

// delete the todo from the database
router.delete("/:id", async (req, res) => {
    // looking for todo
    const todoID = req.params.id;

    // validate the request
    const reqBodyValidation = bodyValidation(req.params, "delete");
    if (reqBodyValidation?.error) {
        res.status(400).send(reqBodyValidation.error.details[0].message);
    }

    const deleteTodo = await deleteTodoByID(todoID);

    res.send(deleteTodo);
});

// function for validating the request body
function bodyValidation(
    reqBody: Object,
    validateMethod: "create" | "update" | "delete"
) {
    const createTodoSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    });

    const deleteTodoSchema = Joi.object({
        id: Joi.string().required(),
    });

    const updateTodoSchema = Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.boolean().required(),
    });

    if (validateMethod === "create") {
        return createTodoSchema.validate(reqBody);
    } else if (validateMethod === "delete") {
        return deleteTodoSchema.validate(reqBody);
    } else if (validateMethod === "update") {
        return updateTodoSchema.validate(reqBody);
    }
}

module.exports = router;
