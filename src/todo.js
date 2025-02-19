import {projFromForm} from './project-creation.js';
import { findObjIdx } from './change-status.js';
import {updateUI, getUIFilter} from './DOM-manip.js';
import { addObjToStorage, retrieveObjFromStorage } from './storage-functions.js';
//import {toggleShow} from "./DOM-manip.js";
const datefns = require('date-fns');

//todo object creator

export function createTodo (todo){
    
    todo = {...todo};
    
    let isComplete = false;
    const uuid = crypto.randomUUID();
    todo.timestamp = new Date().getTime();

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
        //const rawDate = new Date(todo.deadline.replace(/-/g, '\/').replace(/T.+/, ''));
        //console.log(rawDate);
        //const formattedDate = datefns.format(rawDate, 'MM-dd-yyyy');
        //console.log(formattedDate);
        const formattedDate = dateFormat(todo.deadline);
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

export function submitForm(form, type, arrayName, uiFilter){
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
        const uiFilter = getUIFilter();
        updateUI(objList, uiFilter);
        return objList;
    })
}


export function submitEdit(form, array){
    form.addEventListener("submit", (event) =>{
        //get todo being edited from array
        const uuid = form.className.split(' ')[0]; //get uuid from class list
        const idx = findObjIdx(uuid, array);
        const oldTodo = array[idx]; //used uuid to get old todo in array

        event.preventDefault();
        const todoEdit = objFromForm(form) //convert form data to obj
        const newTodo = updateTodo(oldTodo, todoEdit); //update changed fields in todo obj

        //replace old todo with new todo in local storage
        addObjToStorage(newTodo);
        //retrieve updated array
        let objList = retrieveObjFromStorage(array);
        //update UI
        const uiFilter = getUIFilter();
        updateUI(objList, uiFilter);
    })
}

function updateTodo(oldTodo, todoEdit){

    //iterate through key value pairs in new form data
    for (let [key, value] of Object.entries(todoEdit)){
        if(todoEdit[key] !== '' && oldTodo[key] !== value){ //check if same value not present in old todo
            if(key == "deadline"){
                oldTodo[key] = dateFormat(value);
            } else {
                oldTodo[key] = value; //assign new form value to old todo
            }
        }
    }

    return oldTodo;
}

export function deleteTodo(deleteTrigger, array, event){
    deleteTrigger.addEventListener(event, () =>{

        //get parent div to identify associated todo
        const todoElemCont = deleteTrigger.closest('.todo');
        
        //get uuid of todo from class list
        const uuid = todoElemCont.className.split(' ')[0]; //get uuid from class list
        //remove item from local storage using uuid
        localStorage.removeItem(uuid);

        //retrieve updated array
        let objList = retrieveObjFromStorage(array);
        //update UI
        const uiFilter = getUIFilter();
        updateUI(objList, uiFilter);
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
    //console.log(obj);
    return obj;
}

export function getTodos(array, uiFilter){
    let todoArray = array.filter((todo) => todo.getType() === "todo");
    if(uiFilter === "all"){
        todoArray = todoArray;
    } else if (uiFilter == "today"){
        const hoy = datefns.format(new Date(), 'MM-dd-yyyy'); //get today's date, formatted
        todoArray = array.filter((todo) => todo.deadline === hoy);
    }
    else {
        todoArray = array.filter((todo) => todo[uiFilter[0]] === uiFilter[1]);
    }
    return todoArray;
}

function dateFormat(dateString){
    const rawDate = new Date(dateString.replace(/-/g, '\/').replace(/T.+/, ''));
    return datefns.format(rawDate, 'MM-dd-yyyy');
}