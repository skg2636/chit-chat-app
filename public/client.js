const socket = io()

let name;
let textarea = document.querySelector('#textarea');
let messagearea = document.querySelector('.message__area');


do{
    name = prompt('Please Enter Your Name');
}while(!name);

const d= new Date();

setUserName();


const user_detail = {
    user_name : name,
    time : d.getTime()

}

socket.emit('user_connected', user_detail);
user_joined_notification(user_detail,1);

textarea.addEventListener('keyup', (e) =>{
    if(e.key === 'Enter'){
        sendMessage(e.target.value);
        // console.log(e.target.value);
    }
});

function sendMessage(message){
    if(message.length === 1){
        textarea.value = '';
        return;
    }
    let msg = {
        user : name,
        message: message.trim()
    }
    // Append the message

    appendMessage(msg,'outgoing');
    textarea.value = '';
    scrollToBottom();
    // send to server

    socket.emit('message',msg);

}

function appendMessage(msg,type){
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className,'message');
    let markUp;
    if(type === 'incoming'){
        markUp = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    }else{
        markUp = `
        <h4>You</h4>
        <p>${msg.message}</p>
    `
    }

    mainDiv.innerHTML = markUp;

    messagearea.appendChild(mainDiv);
    scrollToBottom();
   


    

}
// recieve message

socket.on('message', (msg) => {
   appendMessage(msg, 'incoming');
   messageNotification();
})


socket.on('new_user_connected', (user_info) => {
   user_joined_notification(user_info,0);



})


function user_joined_notification(user_info,type){
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('user__connected');
    let markUp;
    if(type == 0){
        markUp = `
        <p>${user_info.user_name} joined the chat.</p>
    `;
    }else{
        markUp = `
        <p>You joined the chat.</p>
    `;
    }

    mainDiv.innerHTML = markUp;

    messagearea.appendChild(mainDiv);

}

function messageNotification(){
    let audio = new Audio('/sound.mp3');
    audio.play();
}

function scrollToBottom(){
    messagearea.scrollTop = messagearea.scrollHeight;
}


function setUserName(){
    let user_display_text = document.querySelector('.user__name');

    user_display_text.innerHTML = `Logged In as ${name}`;
}