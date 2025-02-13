import {projFromForm} from './project-creation.js';
import {updateUI} from './DOM-manip.js';
import { addObjToStorage, retrieveObjFromStorage } from './storage-functions.js';
//import {toggleShow} from "./DOM-manip.js";
const datefns = require('date-fns');

//todo object creator

export function createTodo (todo){
    
    todo = {...todo};
    
    let isComplete = false;
    const uuid = crypto.randomUUID();

    //add function to access uuid
    todo.getUUID = () => {
        return uuid;
    }

    //add function to get type
    todo.getType = () => {
        return "todo";
    }

    //format deadline date
    if(todo.deadline){
        //console.log(todo.deadline);
        const rawDate = new Date(todo.deadline.replace(/-/g, '\/').replace(/T.+/, ''));
        //console.log(rawDate);
        const formattedDate = datefns.format(rawDate, 'MM-dd-yyyy');
        //console.log(formattedDate);
        todo.deadline = formattedDate;
    }

    todo.changeComplete = () => { //function to change completion status
        isComplete = !isComplete
        return isComplete;
    };

    todo.getState = () => isComplete; //function to get completion status

    return todo;
};

export function convertTodotoJson(todo){
    const jsonTodo = {...todo, uuid: todo.getUUID(), isComplete: todo.getState(), type: "todo"};
    return JSON.stringify(jsonTodo);
}

export function convertJsontoTodo(todo){
    const uuid = todo.uuid;
    let isComplete = todo.isComplete;

    //add function to access uuid
    todo.getUUID = () => {
        return uuid;
    }

    //add function to get type
    todo.getType = () => {
        return "todo";
    }

    todo.changeComplete = () => { //function to change completion status
        isComplete = !isComplete
        return isComplete;
    };

    todo.getState = () => isComplete; //function to get completion status

    //delete properites that should be private
    delete todo.uuid;
    delete todo.isComplete;
    delete todo.type;

    return todo;
};

export function addObjToArray(arrayName, objName){
    arrayName.push(objName);
}

export function submitForm(form, type, arrayName){
    form.addEventListener("submit", (event) =>{
        event.preventDefault();
        if(type === "todo"){
            var todo = todoFromForm(form);
        } else if(type === "project"){
            var todo = projFromForm(form);
        }
        //add new object to local storage
        addObjToStorage(todo);
        //retrieve new array with updated objects
        let objList = retrieveObjFromStorage(arrayName);
        //console.log(arrayName);
        updateUI(objList);
    })
}

export function todoFromForm(form){
    //add submit event listener to get todo data from form
        const todoData = objFromForm(form);
        //console.log(todoData);
        const todo = createTodo(todoData);
        return todo;
}

export function objFromForm(form){
    const formData = new FormData(form);
    //console.log(formData);
    const obj = Object.fromEntries(formData);
    obj.timestamp = new Date().getTime();
    //console.log(obj);
    return obj;
}

export function getTodos(array){
    const todoArray = array.filter((todo) => todo.getType() === "todo");
    return todoArray;
}