var isItImportant = false;
var serverUrl = "https://fsdi.azurewebsites.net/api";


function toggleImportant() {
    console.log("Icon clicked!");

    if (isItImportant) {
        isItImportant = false;
        $("#iImportant").removeClass('fas').addClass('far');
    } else {
        isItImportant = true;
        $("#iImportant").removeClass('far').addClass('fas');
    }
}

function saveTask() {
    console.log("Saving!");

    // get the values from controls
    let title = $("#txtTitle").val();
    let desc = $("#txtDesc").val();
    let dueDate = $("#txtDueDate").val();
    let alert = $("#selAlert").val();
    let location = $("#txtLocation").val();

    // data validations
    if (!title) {
        $("#errorTitle").removeClass('hide');

        // timer in js
        // 1param: what to do
        // 2param: how much time to wait (in ms)
        setTimeout(
            function () {
                $("#errorTitle").addClass('hide');
            },
            5000
        );

        if (dueDate) // Only show title error if there is a due date - if no title AND no due date,  will not return and will show both errors
            return; // get out of the fn
    }

    if (!dueDate) {
        $("#errorDueDate").removeClass('hide');

        // timer in js
        // 1param: what to do
        // 2param: how much time to wait (in ms)
        setTimeout(
            function () {
                $("#errorDueDate").addClass('hide');
            },
            5000
        );

        return; // get out of the fn
    }


    // create an object
    let theTask = new Task(title, desc, isItImportant, dueDate, alert, location);

    // console log the object
    console.log(theTask);
    console.log(JSON.stringify(theTask));

    // send task to server
    $.ajax({
        url: serverUrl + '/tasks',
        type: 'POST',
        data: JSON.stringify(theTask),
        contentType: "application/json",
        success: function (res) {
            console.log("Server says", res);

            displayTask(res);
        },
        error: function (error) {
            console.error("Error saving", error);
        }
    });

}

function displayTask(task) {
    let alert = "";
    switch (task.alertText) {
        case "1":
            alert = "Don't Forget to:";
            break;
        case "2":
            alert = "Stop:";
            break;
        case "3":
            alert = "Start:";
            break;
        case "4":
            alert = "Get more coffee:";
            break;
    }

    let syntax = `<div id="task${task.id}" class="task">
        <div class="sec-1">
        ${alert}
        <i id="iDelete" onclick="deleteTask(${task.id})" class="far fa-trash-alt"></i>
        </div>
        <div class="sec-2">
            <div class="sec-title">
                <h5>${task.title}</h5>
                <p>${task.description}</p>
            </div>
            
            <div class="sec-date">
                <label>${task.dueDate}</label>
            </div>
                
            <div class="sec-location">
                <label>${task.location}</label>
            </div>
            
        </div>
    </div>`;

    $("#tasksContainer").append(syntax);

    clearForm();
}

function clearForm() {
    $("#txtTitle").val("");
    $("#txtDesc").val("");
    $("#txtDueDate").val("");
    $("#txtLocation").val("");
    $("#selAlert").val("1");
    if (isItImportant) {
        isItImportant = false;
        $("#iImportant").removeClass('fas').addClass('far');
    }
}

function deleteTask(id) {
    console.log("Deleting task: " + id);

    // url: serverUrl + "/tasks/" + id
    // create the code for an AJAX delete req
    $.ajax({
        url: serverUrl + "/tasks/" + id,
        type: "DELETE",
        success: function () {
            console.log("Task removed from server");
            $("#task" + id).remove()
            // opt: 2
            // location.reload();
        },
        error: function (error) {
            console.log("Error removing", error);
        }
    });
}

function retrieveTasks() {
    $.ajax({
        url: serverUrl + '/tasks',
        type: "GET",
        success: function (list) {
            console.log("Retrieved", list);

            for (let i = 0; i < list.length; i++) {
                let task = list[i];

                if (task.user === "mreskey") {
                    displayTask(task);
                }
            }
        },
        error: function (err) {
            console.error("Error reading", err);
        }
    });
}

function init() {
    console.log("Task Manager");

    // load data
    retrieveTasks();

    // hook events
    $("#iImportant").click(toggleImportant);
    $("#btnSave").click(saveTask);
    $("#btnDetails").click(function () {
        $("#details").toggle();
    });
}

window.onload = init;

function testRequest() {
    $.ajax({
        url: "https://restclass.azurewebsites.net/api/test",
        type: 'GET',
        success: function (res) {
            console.log("Server says:", res);
        },
        error: function (errorDet) {
            console.error("Error on req:", errorDet);
        }
    });
}