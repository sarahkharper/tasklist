import { convertJsontoProject, convertProjecttoJson} from './project-creation';
import {addObjToArray, convertJsontoTodo, convertTodotoJson} from './todo.js';

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

export function retrieveObjFromStorage(array){
    array.length = 0; //clear current todoList
    console.log(array);

    //get all objects from storage and add to todoList
    for (var i = 0; i < localStorage.length; i++) {
        const jobj = localStorage.getItem(localStorage.key(i));
        const obj = convertJsontoObj(jobj);
        console.log(obj);
        
        let fullObj;

        if(obj.type == "todo"){
            fullObj = convertJsontoTodo(obj);
        } else if (obj.type == "project"){
            fullObj = convertJsontoProject;
        } else {
            fullObj = obj;
        }
        addObjToArray(array, fullObj);
        console.log(array);
    }
    return array;
}

export function addObjToStorage(obj){
    
    const uuid = obj.getUUID(); //get uuid to serve as key in storage
    const type = obj.getType(); //get type to call correct JSON conversion function

    //convert obj to json
    let jsonObj;

    if(obj.getType() == "todo"){
        jsonObj = convertTodotoJson(obj);
    } else {
        jsonObj = convertProjecttoJson(obj);
    }

    //add item to local storage
    localStorage.setItem(uuid, jsonObj);
}

function convertJsontoObj(obj){
    return JSON.parse(obj);
}