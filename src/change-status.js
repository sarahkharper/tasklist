import {updateUI} from "./DOM-manip.js";

//function for changing status of todo item
export function toggleCompletionStatus(checkbox, array){
    checkbox.addEventListener('change', function() {
        //get parent todo
        const todo = checkbox.closest(".todo");
        const uuid = todo.className.split(' ')[0];
        const todoIndex = findObjIdx(uuid, array);

        //find stored object corresponding to parent todo uuid in storage array
        //call function on stored object to toggle completion status
        array[todoIndex].changeComplete();
        updateUI(array);
    })
}

export function findObjIdx(uuid, array){
    return array.findIndex(td => td.getUUID() === uuid);
}
