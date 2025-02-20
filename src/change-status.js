import { updateUI } from "./DOM-manip.js";

//function for changing status of todo item
export function toggleCompletionStatus(checkbox, array) {
  checkbox.addEventListener("change", function (e) {
    //get parent todo
    const todo = checkbox.closest(".todo");
    const uuid = todo.className.split(" ")[0];
    const todoIndex = findObjIdx(uuid, array);

    //find stored object corresponding to parent todo uuid in storage array
    //call function on stored object to toggle completion status
    array[todoIndex].changeComplete();
    console.log(array[todoIndex].getState());
    updateUI(array);
    console.log(array);
  });
}

export function toggleCheck(obj, checkbox) {
  if (obj.getState()) {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
}

export function findObjIdx(uuid, array) {
  return array.findIndex((td) => td.getUUID() === uuid);
}
