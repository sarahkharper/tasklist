//todo object creator

function basicTodo (n, pri, proj){
    const name = n;
    const priority = pri;
    const project = proj;
    let isComplete = false;

    const changeComplete = () => {
        isComplete = !isComplete
        return isComplete;
    };

    const getState = () => isComplete;

    return {name, priority, project, changeComplete, getState};
};

//create function for adding deadline to todo object
function addDeadline(todo, deadline){ //takes todo (or other) object as input
    return Object.assign({}, todo, { deadline });
}

//create function for adding notes
function addNotes(todo, notes){
    return Object.assign({}, todo, { notes });
}

//function for actually assemblying a todo with designated properties
export function createTodo (name, priority, deadline = null, project = 'misc', notes = null){
    let todo = basicTodo(name, priority, project); //make basic todo
    
    //add deadline field to object
    if (deadline !== undefined){
        todo = addDeadline(todo, deadline);
    }
    
    //if notes present, add notes field to object
    if (notes !== undefined){
        todo = addNotes(todo, notes);
    }
    
    return todo;
};

export const greeting = "Hello!";

