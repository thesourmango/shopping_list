/* Global item counter and item_values */
let item_counter = 2

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

/* Up & Down functionality */
function item_up(element) {
    let upperSibling = element.target.parentElement.previousElementSibling;
    if(upperSibling === null) return;
    upperSibling.insertAdjacentElement("beforebegin", element.target.parentElement);
}
function item_down(element) {
    let lowerSibling = element.target.parentElement.nextElementSibling;
    if(lowerSibling === null) return;
    lowerSibling.insertAdjacentElement("afterend", element.target.parentElement);
}

function attach_updown_listeners() {
    let up_icons = document.querySelectorAll(".up")
    up_icons.forEach(up_icon => {
        up_icon.addEventListener('click', item_up)
    })
    let down_icons = document.querySelectorAll(".down")
    down_icons.forEach(down_icon => {
        down_icon.addEventListener('click', item_down)
    })
}

/* Checkbox functionality */
var checkbox = document.querySelector("input[type=checkbox]")

function check_item(e) {
  if (e.target.checked) {
    console.log("Checked for " + e.target.value)
  } else {
    console.log("Unckecked for "+e.target.value)
  }
}

function attach_check_listeners() {
    let checkboxes = document.querySelectorAll("input[type=checkbox]")
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', check_item)
    })
}


// Init all listeners
attach_trash_listeners()
attach_updown_listeners()
attach_check_listeners()


/* Add item functionality */
function add_item(e) {
    let row = document.createElement("div")
    row.classList.add('row')
    // If user added item using enter key
    if (e.key === "Enter") {
        item_counter++
        row.innerHTML = '<input type="checkbox" id="' + item_counter + '" value="' + e.target.value + '"><label for="' + item_counter + '">' + e.target.value + '</label><span class="up">⬆️</span><span class="down">⬇️</span><span class="trash">❎</span><br>'
        document.querySelector("section").insertBefore(row, e.target)
        /* Reattach all event listeners - check https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver for better alternative */
        attach_trash_listeners()
        attach_updown_listeners()
        attach_check_listeners()
        e.target.value = ""
    }
}
document.querySelector("#new_item").addEventListener("keypress", add_item)