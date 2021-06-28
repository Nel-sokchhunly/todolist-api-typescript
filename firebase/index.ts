const { db } = require("./config");

const todoRef = db.collection("todo-items");

// interfaces
import { TodoObject } from "./globalInterfaces";

// query all todo list
export async function getAllTodo() {
    try {
        let todoItems: TodoObject[] = [];

        const snapshot = await todoRef.get();
        snapshot.forEach((doc: any) => {
            const todoData = doc.data();

            const todo = {
                id: doc.id,
                title: todoData.title,
                description: todoData.description,
                status: todoData.status,
            };

            todoItems.unshift(todo);
        });

        return todoItems;
    } catch (err) {
        return null;
    }
}

// query one todo using ID
export async function getTodoByID(todoID: string) {
    try {
        const snapshot = await todoRef.doc(todoID);
        const doc = await snapshot.get();
        if (doc.exists) {
            return doc.data();
        } else {
            return "Document doesn't exist";
        }
    } catch (err) {
        return null;
    }
}

// add todo to the database
export async function addTodo(todo: TodoObject) {
    try {
        const newTodo = await todoRef.add(todo);

        if (newTodo) {
            console.log(`added successfully`);
        } else {
            console.log("failed to add todo to the database");
        }

        return {
            id: newTodo.id,
            ...todo,
            status: false,
        };
    } catch (err) {
        return null;
    }
}

// update todo in the database
export async function updateTodo(todo: TodoObject) {
    console.log(todo);

    const updatedTodo = await todoRef.doc(todo.id).update(todo);

    if (updatedTodo) {
        console.log(`updated successfully`);
    } else {
        console.log("failed to update todo to the database");
    }

    return {
        id: updatedTodo.id,
        ...todo,
    };
}

// delete todo by ID
export async function deleteTodoByID(todoID: string) {
    try {
        const snapshot = await todoRef.doc(todoID);
        const res = snapshot.delete();
        return `Todo with id: ${todoID} has deleted`;
    } catch (err) {
        return null;
    }
}
