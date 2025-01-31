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

//create function to delete projects (include going back to main task list if deleted project is current display)
