import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";
import { v4 as uuid } from 'uuid';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to the JSON storage file
const storagePath = path.join(__dirname, "./storage/todo.json");

/**
 * Creates a new todo item and saves it to the JSON file.
 *
 * @param {string} task - The description of the task to be added.
 */
export function addTask(task) {
    const tasks = getTasks(); // Read existing tasks
    const id = uuid(); // Generate a unique ID
    const status = 0; // Default status (e.g., incomplete)

    const newTask = {
        id,
        task,
        status
    };

    // Combine old tasks with the new one and write to file
    const updatedTasks = JSON.stringify([...tasks, newTask], null, 2);
    writeTasks(updatedTasks);

    return "Task has been added sucessfully.."
}

export function updateStatus(id, status = 0) {
    if(![0, 1].includes(status)){
        return "Invalid status provided.";
    }

    const tasks = getTasks();

    for (const task of tasks) {
        if(task.id == id){
            task.status = status;
            break;
        }
    }
    
    writeTasks(JSON.stringify(tasks, null, 2));

    return "The Status has been updated sucessfully.";
}

/**
 * Writes the provided tasks data to the JSON file.
 *
 * @param {string} tasks - The stringified JSON data to be saved.
 */
function writeTasks(tasks) {
    if(!tasks) return;

    fs.writeFileSync(storagePath, tasks); // Write data to file
}

/**
 * Reads and returns all tasks from the JSON file.
 * @param {boolean} parse
 *
 * @returns {Array<Object>} An array of task objects.
 */
export function getTasks(parse = true) {
    const data = fs.readFileSync(storagePath); // Read raw file data

    return parse ? JSON.parse(data) : data; // Parse or return JSON / text
}