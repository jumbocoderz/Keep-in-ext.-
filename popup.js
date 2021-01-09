

chrome.storage.sync.get({ 'all_messages': [] }, function (result) {
    let all_messages = result.all_messages;
    let len = 1;
    for(let ind = all_messages.length-1;ind>=0;--ind){
        let curr = all_messages[ind];
        let msg = document.createElement("DIV");    
        msg.setAttribute("class","msg");
        let msg_heading = document.createElement("DIV"); 
        msg_heading.setAttribute("class","msg-heading");
        let name_and_time = document.createElement("DIV"); 
        name_and_time.setAttribute("class","name-and-time");
        curr.name = curr.name.bold();
        name_and_time.innerHTML = curr.name + " " + curr.date_of_message + " at " + curr.time_of_message;
        msg_heading.appendChild(name_and_time); 

        let close = document.createElement("DIV"); 
        close.setAttribute("class","close");
        close.setAttribute("id","cut"+len);
        let x = "x";
        close.innerHTML = x.bold();
        close.onclick = () => {
            let close_id = parseInt(close.id.slice(3,));
            all_messages.splice(-1*close_id,1);
            chrome.storage.sync.set({ 'all_messages': all_messages },function(){
                window.location.href = "popup.html";
            });
        }
        msg_heading.appendChild(close);
        msg.appendChild(msg_heading);

        let msg_body = document.createElement("DIV"); 
        msg_body.setAttribute("class","msg-body");
        msg_body.innerHTML = curr.text;
        msg.appendChild(msg_body);

        document.getElementsByClassName("body")[0].appendChild(msg);
        len++;
    };
});

setTimeout(()=>{
let search_wala = document.getElementsByTagName("input")[0];
search_wala.onkeyup = () => {

    let input = document.getElementById("myInput");
    let filter = input.value.toUpperCase();

    let name_and_time = document.getElementsByClassName("name-and-time");
    Array.from(name_and_time,(curr) => {
            let txtValue = curr.textContent + " " + curr.parentNode.nextElementSibling.textContent;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                curr.parentNode.parentNode.style.display = "";
            } else {
                curr.parentNode.parentNode.style.display = "none";
            }
    })
}
},200);