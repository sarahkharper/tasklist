import { convertJsontoProject } from './project-creation';
import {addObjToArray, convertJsontoTodo} from './todo.js';

//check if local storage available
export function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    } catch (e) {
        return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
        );
    }
}

export function retrieveObjFromStorage(todoList){
    todoList = []; //clear current todoList

    //get all objects from storage and add to todoList
    for (var i = 0; i < localStorage.length; i++) {
        const jobj = localStorage.getItem(localStorage.key(i));
        const obj = convertJsontoObj(jobj);
        
        let fullObj;

        if(obj.type == "todo"){
            fullObj = convertJsontoTodo(obj);
        } else if (obj.type == "project"){
            fullObj = convertJsontoProject;
        } else {
            fullObj = obj;
        }
        addObjToArray(todoList, fullObj);
    }
}

export function addObjToStorage(todoList){
    
}

function convertJsontoObj(obj){
    return JSON.parse(obj);
}