let addBtn = document.querySelector(".newTask")
let toastAdd = document.querySelector(".toast-add")
let toastEdit = document.querySelector(".toast-edit")

let formEdit = toastEdit.querySelector('form')
let formAdd = toastAdd.querySelector('form')
let todoContainer = document.querySelector(".todo__container")
let doingContainer = document.querySelector(".doing__container")
let doneContainer = document.querySelector(".done__container")
let key="keyTaskApp"
let listObject;
let dataStorage = localStorage.getItem(key)

    if(dataStorage){
        listObject=JSON.parse(dataStorage)
    }
    else{
        listObject={
            todo:[],
            doing:[],
            done:[]
        }
    }

function showAndHideAddToast(){
    
    
    addBtn.onclick=()=>toastAdd.style.display="flex"

    toastAdd.onclick=function(e){
        toastAdd.style.display='none'
        let formInputs = formAdd.querySelectorAll(' [name]:not([type="radio"])')
        Array.from(formInputs).forEach(function(e){
                    e.classList.remove("error")
                })
        
    }
    toastEdit.onclick=function(e){
        toastEdit.style.display='none'
        
    }
   
    formAdd.onclick=(e)=>{
        e.stopPropagation();
        if(e.target.closest('.toast-close')){
            toastAdd.style.display="none"
            let formInputs = formAdd.querySelectorAll(' [name]:not([type="radio"])')
            Array.from(formInputs).forEach(function(e){
                        e.classList.remove("error")
                    })
        }
    }
    
    formEdit.onclick=(e)=>{
        e.stopPropagation();
        if(e.target.closest('.toast-close')){
            toastEdit.style.display="none"
            
        }
    }
}
showAndHideAddToast();
// Getdate
function getLongDate(){
    let now = new Date();
    let date = now.getDate();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let year = now.getFullYear();
    let month = months[now.getMonth()];
    let day = `${month} ${date}, ${year}`
    return day;
}
function getData(arrayInput,object){
    object.category=arrayInput[0].value;
    object.title=arrayInput[1].value;
    object.content=arrayInput[2].value;
    object.day=getLongDate();
    arrayInput.forEach(function(e){
        e.value=''
        e.classList.remove("valid")
    })
    return object;
}
// Validation
// Validation
// Validation
// Validation Form
function validate(element){
    let elementContent = element.value;
    if(elementContent!=''){
        element.classList.add("valid");
        element.classList.remove("error");
    }
    else{
        element.classList.remove("valid")
        element.classList.add("error")
    }
    return !!elementContent
}
function Validator(options){

    //Lấy form cần validate và các input
    let formElement = document.querySelector(options);
    let inputElements = formElement.querySelectorAll('[name]:not([type="radio"])')
    let arrayInput = Array.from(inputElements);

    // Khi blur ra ngoai => validate
    arrayInput.forEach(function(e){
        e.onblur=function(){
        e.value=e.value.trim();
            validate(e);
        }
    })

    let submitBtn = formElement.querySelector('input[type="submit"]')
    submitBtn.onclick = function(e){
        e.preventDefault();
        let trueFalse;
        for(let i in arrayInput){
            trueFalse = validate(arrayInput[i])
            if(!trueFalse){   
              break;
            }
        }
        for(let i in arrayInput){
            validate(arrayInput[i])
        }
        // Nếu không có lỗi thì tiếp tục công việc
        if(trueFalse){
           addNewTask(arrayInput);
        }
    }
    
}
function getParent(element,parentClassName){
    let parent = element.parentElement
    while(!parent.className.includes(parentClassName)){
        parent=parent.parentElement;
    }
    return parent;
}
function addNewTask(arrayInput){
    let object ={
        category: '',
        title: '',
        content: '',
        day: '',
        status: 'todo'
    }

    object = getData(arrayInput,object)
    let newTask = document.createElement('div')
    newTask.className="task-box"
    newTask.innerHTML=`<div class="task__header">
        <div class="heading">
            <a href="" class="category">${object.category}</a>
            <h4 class="title">${object.title}</h4>
        </div>
        <div class="interact">
            <i class="fa-solid fa-pen" onmousedown="editTask()"></i>
            <i class="fa-solid fa-trash " onmousedown="removeTask()"></i>
        </div>
    </div>
    <span class="content">${object.content}</span>
    <span class="dayCreate"><i class="fa-regular fa-clock"></i>${object.day}</span>
    `
    todoContainer.appendChild(newTask)
    listObject.todo.push(object)
    toastAdd.style.display="none"
    // Lưu biến listObject vào localStorage
    localStorage.setItem(key,JSON.stringify(listObject))
    autoCount()
}
function render(){
    let todoTask=[],doingTask=[],doneTask=[];
    for(let i in listObject){
        for(let j =0;j<listObject[i].length;j++){
            let stringValue= `<div class="task-box" >
            <div class="task__header">
            <div class="heading">
                <a href="" class="category">${listObject[i][j].category}</a>
                <h4 class="title">${listObject[i][j].title}</h4>
            </div>
            <div class="interact">
                <i class="fa-solid fa-pen" onmousedown="editTask()"></i>
                <i class="fa-solid fa-trash " onmousedown="removeTask()" ></i>
            </div>
        </div>
        <span class="content">${listObject[i][j].content}</span>
        <span class="dayCreate"><i class="fa-regular fa-clock"></i>${listObject[i][j].day}</span>
        </div>`
        switch(i){
            case "todo": todoTask.push(stringValue); break;
            case "doing": doingTask.push(stringValue); break;
            case "done": doneTask.push(stringValue); break;
            default: break;
        }
        }
     }
     todoContainer.innerHTML=todoTask.join('')
     doingContainer.innerHTML=doingTask.join('')
     doneContainer.innerHTML=doneTask.join('')
    autoCount()
 }
 render()
function removeTask(){
    let containers = document.querySelectorAll('.duty__container')
        for(let i=0;i<containers.length;i++){
            
            containers[i].onmousedown=(e)=>{
                if(e.target.closest('.fa-trash')){
                    let removeIcons = containers[i].querySelectorAll(".fa-trash")
                    for(let j =0;j<removeIcons.length;j++){
                        removeIcons[j].onclick=()=>{
                            
                            // lấy taskbox chứa icon được click
                            let parentElement = getParent(removeIcons[j],"task-box")
                            parentElement.remove();
                            switch(i){
                                case 0:   
                                listObject.todo.splice(j,1)
                                    
                                break;
                                case 1: 
                                listObject.doing.splice(j,1);
                                    break;
                                case 2:
                                listObject.done.splice(j,1); 

                                break;
                                default: break;
                            }
                            
                            localStorage.setItem(key,JSON.stringify(listObject))
                            autoCount()
                        }
                    }
                }
                
            }
        }


}
function editTask(){
    
    let containers = document.querySelectorAll('.duty__container')
    for(let index in containers){
        
        containers[index].onmousedown=(e)=>{
            
            let keyListObject;
            switch(index){
                case "0":  keyListObject= "todo"; break;
                case "1": keyListObject = "doing"; break;
                case "2": keyListObject = "done"; break;
            }
            if(e.target.closest('.fa-pen')){
                let editIcons = containers[index].querySelectorAll(".fa-pen")
                for(let i in editIcons){
                    editIcons[i].onclick=()=>{
                        toastEdit.style.display="flex"
                        // Lay task-box cha
                        let parentElement = getParent(editIcons[i],"task-box");
                        // Validation form edit
                        let formElement = document.querySelector("#formEdit");
                        let inputElements = formElement.querySelectorAll('[name]:not([type="radio"])')
                        let arrayInput = Array.from(inputElements);
                        let radios = formElement.querySelectorAll('[name="status"]')
                        // lấy object cần edit
                        
                        let object = listObject[keyListObject][i];
                        // Lay data cua object để đưa vào form edit
                        arrayInput[0].value=object.category;
                        arrayInput[1].value=object.title;
                        arrayInput[2].value=object.content;
                        formElement.querySelector('#'+object.status).checked=true;
            
                        // Khi blur ra ngoai => validate
                        arrayInput.forEach(function(e){
                            e.onblur=function(){
                            e.value=e.value.trim();
                                validate(e);
                            }
                        })
            
                        let submitBtn = formElement.querySelector('input[type="submit"]')
                        submitBtn.onclick = function(e){
                            e.preventDefault();
                            let trueFalse;
                            for(let j in arrayInput){
                                trueFalse = validate(arrayInput[j])
                                if(!trueFalse){   
                                break;
                                }
                            }
                            for(let j in arrayInput){
                                validate(arrayInput[j])
                            }
            
            
                            // Nếu không có lỗi thì tiếp tục công việc
                            // Nếu không có lỗi thì tiếp tục công việc
                            if(trueFalse){
                                object = getData(arrayInput,object);
                                
                                // Cap  nhat status
                                for(let jay in radios){
            
                                    if(radios[jay].checked){
                                      
                                        if ( object.status.localeCompare(radios[jay].id) !=0  ){
                                            
                                            switch(jay){
                                                case "0": object.status="todo";  break;
                                                case "1": object.status="doing";  break;
                                                case "2": object.status="done";  break;
                                                
                                            }
                                            let newTask = document.createElement('div')
                                            newTask.className="task-box"
                                            newTask.innerHTML=`<div class="task__header">
                                                <div class="heading">
                                                    <a href="" class="category">${object.category}</a>
                                                    <h4 class="title">${object.title}</h4>
                                                </div>
                                                <div class="interact">
                                                    <i class="fa-solid fa-pen" onmousedown="editTask()"></i>
                                                    <i class="fa-solid fa-trash " onmousedown="removeTask()"></i>
                                                </div>
                                            </div>
                                            <span class="content">${object.content}</span>
                                            <span class="dayCreate"><i class="fa-regular fa-clock"></i>${object.day}</span>
                                            `  
                                            switch(object.status){
                                                case "todo":  todoContainer.appendChild(newTask);
                                                    listObject.todo.push(object)
                                                    listObject[keyListObject].splice(i,1)
                                                    break;
                                                case "doing":  doingContainer.appendChild(newTask);  
                                                    listObject.doing.push(object)
                                                    listObject[keyListObject].splice(i,1)
                                                    break;
                                                case "done":  doneContainer.appendChild(newTask); 
                                                    listObject.done.push(object)
                                                    listObject[keyListObject].splice(i,1)
                                                    break;
                                                
                                            }
                                            parentElement.remove();
                                            
                                        }
                                        else{
                                            // Cap nhat noi dung trong DOM
                                            parentElement.querySelector('.category').innerText=object.category;
                                            parentElement.querySelector('.title').innerText=object.title;
                                            parentElement.querySelector('.content').innerText=object.content;
                                        }
                                    }
                                }
                                toastEdit.style.display="none"
                                localStorage.setItem(key,JSON.stringify(listObject))
                                autoCount()
            
                            }
                        }
            
                    }
                }
    }
    
}
}
}

function autoCount(){
    let amountSpans = document.querySelectorAll(".duty__count")
    Array.from(amountSpans)
 
    for(let i=0;i< amountSpans.length;i++){
        let column = getParent(amountSpans[i],"col-3")
        let taskList = column.querySelectorAll(".task-box")
        Array.from(taskList)
        amountSpans[i].innerText=String(taskList.length)
    }
}
autoCount()
