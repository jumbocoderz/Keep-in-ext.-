

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type === "main_page") {
            setTimeout(() => {
                let msg_bar = document.getElementById("msg-overlay");
                if (msg_bar != null && msg_bar != undefined) {

                    let observer = new MutationObserver((mutations) => {
                        let ele = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled");
                        if (ele != null && ele.length > 0) {
                            everything(message.fulldb);
                        }
                    });
                    observer.observe(msg_bar, { childList: true });
                }

                let ele = document.querySelectorAll(".msg-s-event-listitem__message-bubble.msg-s-event-listitem__message-bubble--msg-fwd-enabled");
                if (ele != null && ele.length > 0) {
                    everything(message.fulldb);
                }
            }, 1000);
        }
    });


    

