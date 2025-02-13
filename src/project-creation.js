import {objFromForm} from './todo.js';

//add project from form
export function projFromForm(form){
    const projData = objFromForm(form);
    const proj = createProj(projData);
    return proj;
}

function createProj(proj){
    proj = {...proj};
    
    const uuid = crypto.randomUUID();

    //add function to access uuid
    proj.getUUID = () => {
        return uuid;
    }

    proj.getType = () => {
        return "project";
    }

    return proj;
}

//create function to convert project to JSON
export function convertProjecttoJson(proj){
    const jsonProj = {...proj, uuid: proj.getUUID(), type: "project"};
    return JSON.stringify(jsonProj);
}

//create function to convert project from JSON to JS
export function convertJsontoProject(jsonProj){
    const proj = JSON.parse(jsonProj);

    //add function to access uuid
    const uuid = proj.uuid;
    proj.getUUID = () => uuid;

    //add function to get type
    proj.getType = () => "project";

    //delete properties that should be private
    delete proj.uuid;
    delete proj.type;
    
    return proj;
}

//create function to delete projects (include going back to main task list if deleted project is current display)
