chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.runtime.sendMessage({
            tabId: tabs[0].id,
            type: "read",
            come_from: "popup"
        });
})


chrome.runtime.onMessage.addListener((message, sender) => {

    if (message.type === "send_data_to_pop_up") {

        let len = 1;
        let fulldb = message.fulldb;
        for (let ind = fulldb.length - 1; ind >= 0; --ind) {
            let curr = fulldb[ind];

            let msg = document.createElement("DIV");
            msg.setAttribute("class", "msg");
            
            let msg_heading = document.createElement("DIV");
            msg_heading.setAttribute("class", "msg-heading");
            
            let left_heading = document.createElement("DIV");
            left_heading.setAttribute("class", "left-heading");
            let name_and_time = document.createElement("DIV");
            name_and_time.setAttribute("class", "name-and-time");
            let name_of_sender = document.createElement("SPAN");
            name_of_sender.setAttribute("class", "name-of-sender");
            name_of_sender.innerHTML = curr.name + " ";
            let timing = document.createElement("SPAN");
            timing.setAttribute("class", "timing");
            timing.innerHTML = curr.date_of_message + " at " + curr.time_of_message;
            name_and_time.appendChild(name_of_sender);
            name_and_time.appendChild(timing);
            let edit_icon = document.createElement("DIV");
            edit_icon.setAttribute("class","edit-icon");
            edit_icon.innerHTML = "📝"; 
            left_heading.appendChild(name_and_time);
            left_heading.appendChild(edit_icon);
            msg_heading.appendChild(left_heading);

            let close = document.createElement("DIV");
            close.setAttribute("class", "close");
            close.setAttribute("id", "cut" + len);
            let x = "x";
            close.innerHTML = x.bold();
            close.onclick = () => {
                msg.style.display = "none";             
                chrome.runtime.sendMessage({
                    type: "delete",
                    key: curr.key
                });     
            }
            msg_heading.appendChild(close);
            msg.appendChild(msg_heading);
            
            let msg_body = document.createElement("DIV");
            msg_body.setAttribute("class", "msg-body");
            let final_text = "";
            for(let i = 0; i<curr.text.length; ++i){
                if(curr.text[i]=="<"){
                    while(i<curr.text.length && curr.text[i]!=">")
                        ++i;
                }
                else {
                    final_text += curr.text[i];
                }
            }
            if(final_text.length>=180)
                msg_body.innerHTML = final_text.slice(0,180) + "<span class='hyperlink'>...Read more<span>";
            else
                msg_body.innerHTML = final_text;
            msg.appendChild(msg_body);

            let msg_extra_text = document.createElement("div");
            msg_extra_text.setAttribute("class","msg-extra-text");
            msg_extra_text.innerHTML = curr.extra_text;
            msg.appendChild(msg_extra_text);

            if(msg_extra_text.innerHTML==="")
                msg_extra_text.style.display = "none";

            document.getElementsByClassName("body")[0].appendChild(msg);

            edit_icon.onclick = () => {
                msg_extra_text.style.display = "";
                let text_area = document.createElement("TEXTAREA");
                text_area.value = msg_extra_text.innerHTML;
                msg_extra_text.innerHTML = "";
                let save_button = document.createElement("BUTTON");
                save_button.innerHTML = "Save";
                msg_extra_text.appendChild(text_area);
                msg_extra_text.appendChild(save_button);
                save_button.onclick = () => {
                    let final_extra_text = text_area.value; 
                    text_area.style.display = "none";
                    save_button.style.display = "none";
                    if(final_extra_text===""){
                        msg_extra_text.innerHTML = "";
                        msg_extra_text.style.display = "none";
                    }
                    else{
                        msg_extra_text.innerHTML = final_extra_text;
                    }
                    chrome.runtime.sendMessage({
                        type: "update",
                        final_value: {
                            "name": curr.name,
                            "text": curr.text,
                            "time_of_message": curr.time_of_message,
                            "date_of_message": curr.date_of_message,
                            "message_thread": curr.message_thread,
                            "list_number": curr.list_number,
                            "extra_text": final_extra_text
                        }
                    });
                }
            }

            msg_body.onclick = () => {
                msg_body.innerHTML = final_text;
                let whole_link = "https://linkedin.com/messaging/thread/" + curr.message_thread + "/";
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                    chrome.tabs.update(tabs[0].id, { active: true, url: whole_link }, (tab) => {
                        setTimeout(() => {
                            chrome.tabs.sendMessage(
                                tabs[0].id,
                                {
                                    text: curr.text,
                                    type: "link_transfer"
                                });

                        }, 4000);

                    })
                });
            }

            len++;
        };

        setTimeout(() => {
            let search_wala = document.getElementsByTagName("input")[0];
            search_wala.onkeyup = () => {

                let input = document.getElementById("myInput");
                let filter = input.value.toUpperCase();
                let all_words = filter.split(" ");
                let name_and_time = document.getElementsByClassName("name-and-time");

                Array.from(name_and_time, (curr) => {
                    let cnt = 0;
                    Array.from(all_words, (word) => {   
                            let txtValue = curr.textContent + " " + curr.parentNode.parentNode.nextElementSibling.textContent + " " + curr.parentNode.parentNode.nextElementSibling.nextElementSibling.textContent;
                            if (txtValue.toUpperCase().indexOf(word) > -1) {
                                ++cnt;
                            } 
                    })
                    if((cnt>0 && cnt===all_words.length) || (all_words.length===1 && all_words[0]==="")){
                        curr.parentNode.parentNode.parentNode.style.display = "";
                    }
                    else {
                        curr.parentNode.parentNode.parentNode.style.display = "none";
                    }
                    
                })
            }
        }, 200);
    }

});


document.getElementsByClassName("logo")[0].onclick = () => {
    let link = "https://github.com/jumbocoderz/Keep-in-ext.-";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

        chrome.tabs.update(tabs[0].id, { active: true, url: link }, (tab) => {
            setTimeout(() => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        link: link,
                        type: "keep_in_link"
                    });

            }, 4000);

        })
    });
}