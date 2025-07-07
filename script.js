/* Global item counter and item_values */
let item_counter = 2

/* Check if theres a list in localstorage */
const saved_list = localStorage.getItem('item_list');
if (saved_list !== null && JSON.parse(saved_list).length !== 0 && saved_list !== "false") {
    console.log('Found saved list: ', JSON.parse(saved_list));
    const saved_array = JSON.parse(saved_list)
    // Reset list and reload from localstorage
    item_counter = 0
    document.querySelector("section").innerHTML = '<input type="text" id="new_item">'
    // Add all list elements from localstorage to DOM
    saved_array.forEach(list_item => {
        add_item(list_item)
    });
}



/* Trashcan functionality */
function remove_item(element) {
    // console.log(element.target.parentElement) // debug
    element.target.parentElement.remove() // remove whole row
    track_list_items() // Update localstorage item variable
}

function attach_trash_listeners() {
    let trash_icons = document.querySelectorAll(".trash")
    trash_icons.forEach(trash_can => {
        trash_can.addEventListener('click', remove_item)
    })
}

/* drag and drop functionality */
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    // Don't allow dropping element on itself, nor on section (parent "visible" due to padding)
    if (data != ev.target.parentElement.id && ev.target.parentElement.classList[0] == "row") {
        ev.target.parentElement.insertAdjacentElement("afterend", document.getElementById(data));
        track_list_items()
    }
}

/* Checkbox functionality */
var checkbox = document.querySelector("input[type=checkbox]")

function check_item(e) {
    if (e.target.checked) {
        //console.log("Checked for " + e.target.value)
        document.querySelector('#new_item').insertAdjacentElement("afterend", e.target.parentElement); // Move item to bottom
        track_list_items()
    } else {
        //console.log("Unckecked for " + e.target.value)
        document.querySelector('#new_item').insertAdjacentElement("beforebegin", e.target.parentElement); // Move item to bottom
        track_list_items()
    }
}

function attach_check_listeners() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]")
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', check_item)
    })
}

/* Edit functionality */
function edit_item(element) {
    let current_item = element.target.parentElement.querySelector("label")
    current_item.setAttribute("contenteditable", "true") // Make label editable
    // Focus caret (marker) to end of contenteditable element
    current_item.focus()
    let sel = window.getSelection();
    sel.selectAllChildren(current_item);
    sel.collapseToEnd();
    // Preventdefault on Enter key and trigger edit completed followed by update to DB
    current_item.addEventListener("keypress", stop_editing)
}

function stop_editing(ev) {
    const current_item = ev.target // The current contenteditable element
    if (ev.key === "Enter") {
        ev.preventDefault();
        current_item.setAttribute("contenteditable", "false") // Turn off contenteditable
        current_item.parentElement.querySelector("input").value = current_item.innerText // Set checkbox value to input text
        track_list_items() // Update localstorage item variable
    }
}

function attach_edit_listeners() {
    let edit_icons = document.querySelectorAll(".edit")
    edit_icons.forEach(editable_item => {
        editable_item.addEventListener('click', edit_item)
    })
}

// Init all listeners
attach_trash_listeners()
attach_check_listeners()
attach_edit_listeners()

/* Add item functionality */
function add_item(e) {
    let row = document.createElement("div")
    row.classList.add('row')
    row.setAttribute("id", item_counter)
    row.setAttribute("draggable", "true")
    row.setAttribute("ondragstart", "drag(event)")
    // If user added item using enter key
    if (e.key === "Enter") {
        row.innerHTML = '<input type="checkbox" id="' + item_counter + '" value="' + e.target.value + '"><label for="' + item_counter + '">' + e.target.value + '</label><span class="edit">📝</span><span class="trash">❎</span><br>'
        document.querySelector("section").insertBefore(row, e.target)
        /* Reattach all event listeners - check https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver for better alternative */
        attach_trash_listeners()
        attach_check_listeners()
        attach_edit_listeners()
        track_list_items()
        e.target.value = ""
        item_counter++
    }
    // When fetching list from localstorage
    else if (e.key == undefined) {
        // Add textbox. Do this first so checked/unchecked items can be placed below/above
        document.querySelector("section").insertBefore(row, document.querySelector("#new_item"))
        // If saved list item has been checked
        if (e.checked == true) {
            row.innerHTML = '<input type="checkbox" id="' + item_counter + '" value="' + e.item + '" checked><label for="' + item_counter + '">' + e.item + '</label><span class="edit">📝</span><span class="trash">❎</span><br>'
            document.querySelector('#new_item').insertAdjacentElement("afterend", row); // Place checked items below add new box
        }
        else {
            row.innerHTML = '<input type="checkbox" id="' + item_counter + '" value="' + e.item + '"><label for="' + item_counter + '">' + e.item + '</label><span class="edit">📝</span><span class="trash">❎</span><br>'
            document.querySelector('#new_item').insertAdjacentElement("beforebegin", row); // Place unchecked items before input box

        }
        attach_trash_listeners()
        item_counter++
    }
}
document.querySelector("#new_item").addEventListener("keypress", add_item)


/* State management for localstorage */
function track_list_items() {
    let item_values = [];
    let items = document.querySelectorAll('input:not([type="text"])')
    items.forEach(item => {
        item_values.push({ "item": item.value, "number": item.id, "checked": item.checked })
    })
    //console.log(item_values) // debug, displays list before sending update to DB
    localStorage.setItem('item_list', JSON.stringify(item_values))
    update_db(item_values)
}

/* Ajax function for updating items in db */
async function update_db(item_values) {
    fetch("./update.php", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(item_values)
    })
        .then(response => response.json())
        .then(json => console.log(json));
}

/* Refresh page when user returns focus to tab (reopens tab, swaps to open PWA) */
// Source https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    location.reload();
  }
});

/* Service worker registration */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/shop/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

/* Notification support coming soon 
// Request Notification Permission
document.getElementById('requestPermission').addEventListener('click', () => {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.log('Notification permission denied.');
            }
        });
    } else {
        console.log('This browser does not support notifications.');
    }
});

// Send Test Notification
document.getElementById('sendNotification').addEventListener('click', () => {
    if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification('Notes', {
                body: 'Kolla köplistan!',
            });
        });
    } else if ('Notification' in window && Notification.permission === 'denied') {
        alert('Notification permission was denied. Please enable it in your browser settings.');
    } else {
        alert('Notifications are not supported or permission not granted.');
    }
});
*/