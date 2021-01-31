
function extract_name_and_timing_of_message(dup_list_node) {
    let name = "", time_of_message = "";
    while (true) {
        let abhi = dup_list_node.getElementsByTagName("div")[0];
        if (abhi.childNodes[2].nodeName == "A") {
            name = abhi.getElementsByTagName("div")[0].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerHTML;
            name = name.trim();
            time_of_message = abhi.getElementsByTagName("div")[0].getElementsByTagName("time")[0].innerHTML;
            time_of_message = time_of_message.trim();
            break;
        }
        else
            dup_list_node = dup_list_node.previousElementSibling;
    }
    return [name, time_of_message];
}

function extract_date_of_sending_message(dup_list_node) {
    let final_date_of_message = "";
    while (true) {
        let abhi = dup_list_node.getElementsByTagName("time");
        if (abhi.length == 2) {
            date_of_message = abhi[0].innerHTML;
            date_of_message = date_of_message.trim();
            if (date_of_message == "Today") {
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let full_date = new Date();
                let only_date = full_date.getDate();
                let only_month = months[full_date.getMonth()];
                let only_year = full_date.getFullYear();
                final_date_of_message = only_month + " " + only_date + " " + only_year;
            }
            else if (date_of_message[date_of_message.length - 1] == "y") {
                let days = {
                    "Sunday": 0,
                    "Monday": 1,
                    "Tuesday": 2,
                    "Wednesday": 3,
                    "Thursday": 4,
                    "Friday": 5,
                    "Saturday": 6
                };
                let number_of_day = days[date_of_message];
                let full_date = new Date();
                let only_day = full_date.getDay();
                while (only_day != number_of_day) {
                    full_date.setDate(full_date.getDate() - 1);
                    only_day = (only_day - 1 + 7) % 7;
                }
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let only_date = full_date.getDate();
                let only_month = months[full_date.getMonth()];
                let only_year = full_date.getFullYear();
                final_date_of_message = only_month + " " + only_date + " " + only_year;
            }
            else {
                if (date_of_message.length <= 6) {
                    let full_date = new Date();
                    let only_year = full_date.getFullYear();
                    date_of_message = date_of_message + " " + only_year;
                }
                final_date_of_message = date_of_message;
            }
            break;
        }
        else
            dup_list_node = dup_list_node.previousElementSibling;
    }
    return final_date_of_message;
}

function extract_thread_link(link_element) {
    let full_value = link_element.getAttribute("data-event-urn");
    full_value = full_value.slice(17, -1);
    let thread = full_value.split(",", 1)[0];
    return thread;
}

function extract_list_number(dup_list_node) {
    let unordered_list = dup_list_node.parentNode.childNodes;
    let cnt = 0, ans = -1;
    Array.from(unordered_list, function (curr) {
        if (curr === dup_list_node)
            ans = cnt;
        if (curr.tagName === "LI") {
            ++cnt;
        }

    })
    return ans;
}

function everything(fulldb) {
    setTimeout(() => {

        let ele = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled");
        let u_list = document.getElementsByClassName("msg-s-message-list-content list-style-none full-width")[0];

        if (u_list != undefined && u_list != null) {
            let observer = new MutationObserver((mutations) => {
                everything(fulldb);
            });
            observer.observe(u_list, { childList: true });
        }

        Array.from(ele, function (curr) {
            let para_of_text = curr.getElementsByTagName("P")[0];
            let whole_text = curr.getElementsByTagName("P")[0].innerHTML;
            let spans = para_of_text.getElementsByTagName("SPAN");
            let already_star=0;
            if(spans.length!=0){
                let last_span = spans[spans.length-1];
                if(last_span.innerHTML==="⭐")
                    already_star = 1;
            }
            if (already_star===0) {
                let list_node = curr.parentNode.parentNode;
                let name = "", time_of_message = "", final_text = whole_text.slice(0, -7);
                [name, time_of_message] = extract_name_and_timing_of_message(list_node);
                let final_date_of_message = extract_date_of_sending_message(list_node);

                for (let ind = 0; ind < fulldb.length; ++ind) {
                    if (fulldb[ind].name == name && fulldb[ind].text == final_text && fulldb[ind].time_of_message == time_of_message && fulldb[ind].date_of_message == final_date_of_message) {
                        let star_span = document.createElement("SPAN");
                        star_span.innerHTML = "⭐";
                        star_span.style.fontSize = "10px";
                        curr.getElementsByTagName("P")[0].appendChild(star_span);
                        break;
                    }
                }
            }
        });

        Array.from(ele, function (curr) {
            curr.addEventListener("mouseover", () => {
                setTimeout(() => {
                    let hover_ke_baad_wala_div = document.getElementsByClassName("msg-s-event-listitem__actions-container artdeco-card")[0];
                    if (hover_ke_baad_wala_div != undefined) {

                        let next_sibling_uss_div_ka = hover_ke_baad_wala_div.nextElementSibling;
                        let flag = 0, final_text="";
                        let whole_text = next_sibling_uss_div_ka.innerHTML;
                        let spans = next_sibling_uss_div_ka.getElementsByTagName("SPAN");
                        if(spans.length!=0){
                            let last_span = spans[spans.length-1];
                            if(last_span.innerHTML==="⭐")
                                flag=1;    
                        }
                        if(flag===1)
                            final_text = whole_text.slice(0, -46);
                        else
                            final_text = whole_text.slice(0, -7);

                        let list_node = hover_ke_baad_wala_div.parentNode.parentNode.parentNode;

                        let name = "", time_of_message = "";
                        [name, time_of_message] = extract_name_and_timing_of_message(list_node);
                        let final_date_of_message = extract_date_of_sending_message(list_node);

                        let emoji_list = document.getElementsByClassName("emoji-popular-list__item");
                        if (emoji_list.length == 5) {

                            let list_ele = document.createElement("LI");
                            list_ele.setAttribute("role", "menuitem");

                            let div_ele = document.createElement("DIV");
                            div_ele.setAttribute("aria-label", "React with saving items");
                            div_ele.setAttribute("class", "emoji-popular-list__item");
                            div_ele.setAttribute("tabindex", "0");
                            div_ele.setAttribute("title", "save message");

                            let span_ele = document.createElement("SPAN");
                            span_ele.setAttribute("class", "emoji-popular-list__item-emoji");

                            if (flag == 0)
                                span_ele.innerHTML = "⛤";
                            else {
                                span_ele.innerHTML = "⭐";
                            }
                            div_ele.appendChild(span_ele);
                            list_ele.appendChild(div_ele);
                            document.getElementsByClassName("emoji-popular-list__container")[0].appendChild(list_ele);
                        }
                        let list_ele = document.getElementsByClassName("emoji-popular-list__container");
                        if (flag === 1) {
                            document.getElementsByClassName("emoji-popular-list__container")[0].lastElementChild.getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerHTML = "⭐";
                        }
                        if (list_ele != undefined && list_ele != null && list_ele[0] != undefined) {
                            let list_ele_0 = list_ele[0].lastElementChild;
                            if (list_ele_0 != undefined) {
                                list_ele_0.onclick = function () {
                                    if (flag == 0) {
                                        flag=1;
                                        let save = "⭐";
                                        list_ele_0.getElementsByTagName("div")[0].getElementsByTagName("span")[0].innerHTML = save;
                                        let star_span = document.createElement("SPAN");
                                        star_span.innerHTML = "⭐";
                                        star_span.style.fontSize = "10px";
                                        next_sibling_uss_div_ka.appendChild(star_span);
                                        
                                        let message_thread = extract_thread_link(hover_ke_baad_wala_div.parentNode.parentNode);
                                        let list_number = extract_list_number(list_node);
                                        let new_message = {
                                            "name": name,
                                            "text": final_text,
                                            "time_of_message": time_of_message,
                                            "date_of_message": final_date_of_message,
                                            "message_thread": message_thread,
                                            "list_number": list_number,
                                            "extra_text": ""
                                        };

                                        fulldb.push(new_message);
                                        chrome.runtime.sendMessage({
                                            type: "add",
                                            new_message: new_message,
                                            fulldb: fulldb
                                        });
                                    }
                                }
                            }
                        };
                    }
                }, 500);
            })
        })
    }, 700);
}

function find_msg(prev_cnt, curr_cnt, text) {

    let unordered_list = document.getElementsByClassName("msg-s-message-list-content list-style-none full-width")[0].childNodes;
    let cnt = 0, is_message_viewed = false;
    let arr = Object.values(unordered_list);
    curr_cnt = arr.length;
    if (prev_cnt === curr_cnt) {
        return;
    }

    for (let ind = 0; ind < arr.length; ++ind) {
        if (arr[ind].tagName === "LI") {
            let para = arr[ind].getElementsByClassName("msg-s-event-listitem__body t-14 t-black--light t-normal")[0];
            if (para != null && para != undefined) {
                let spans = para.getElementsByTagName("SPAN");
                let star=0;
                if(spans.length!=0){
                    let last_span = spans[spans.length-1];
                    if(last_span.innerHTML==="⭐")
                        star = 1;
                }
                let curr_text="";
                if(star===1)
                    curr_text = para.innerHTML.slice(0,-46);
                else 
                    curr_text = para.innerHTML.slice(0,-7);
                if (curr_text === text) {
                    arr[ind].scrollIntoView();
                    is_message_viewed = true;
                    break;
                }
            }
        }
    }

    if (is_message_viewed === false) {
        let ctt = 0;
        for (let ind = 0; ind < arr.length; ++ind) {
            if (arr[ind].tagName === "LI" && ctt == 1) {
                arr[ind].scrollIntoView();
                setTimeout(() => {
                    find_msg(curr_cnt, curr_cnt, text);
                }, 1000);
                break;
            }
            if (arr[ind].tagName === "LI")
                ++ctt;
        }
    }
}

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type === "link_transfer") {

            let prev_cnt = 0, curr_cnt = 0;
            find_msg(prev_cnt, curr_cnt, message.text);
        }
        else if (message.type === "keep_in_link") {
            window.open(message.link);
        }
    }
);
