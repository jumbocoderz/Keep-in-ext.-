

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        if (message.type === "call_everything_from_main_page") {

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
            }, 1000);
        }
    });

