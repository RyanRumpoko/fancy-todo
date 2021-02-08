const baseUrl = "http://localhost:3000/"
let todoId

function auth() {
  if (!localStorage.getItem("token")) {
    $("#container-user-signin").show()
    $("#container-user-signup").hide()
    $("#container-welcome-sign").show()
    $("#container-todo-all").hide()
    $("#card-list").hide()
    $("nav").hide()
  } else {
    $("#container-user-signin").hide()
    $("#container-user-signup").hide()
    $("#container-welcome-sign").hide()
    $("#container-todo-all").show()
    $("#card-list").show()
    $("nav").show()
    $("#edit-text").hide()
    $("#submit-add").show()
    $("#submit-edit").hide()
    $("#cancel-edit").hide()
    getTodo()
  }
}

// All User Handler
function signin() {
  const email = $("#signin-email").val()
  const password = $("#signin-password").val()
  $.ajax({
    method: "POST",
    url: baseUrl + "users/signIn",
    data: {
      email,
      password
    }
  })
    .done((users) => {
      localStorage.setItem("token", users.accessToken)
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always(_ => {
      $("#signin-email").val("")
      $("#signin-password").val("")
    })
}

function signup() {
  const email = $("#signup-email").val()
  const password = $("#signup-password").val()
  $.ajax({
    method: "POST",
    url: baseUrl + "users/signUp",
    data: {
      email,
      password
    }
  })
    .done(_ => {
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always(_ => {
      $("#signup-email").val("")
      $("#signup-password").val("")
    })
}

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  console.log(id_token);
  $.ajax({
    url: baseUrl + "users/googleLogin",
    method: "POST",
    data: {
      googleToken: id_token
    }
  })
    .done(data => {
      localStorage.setItem("token", data.accessToken)
      auth()
    })
    .fail((xml, err) => {
      console.log(xml, err);
    })
}

function logout() {
  localStorage.clear()
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  auth()
}

// All Todo Handler
function getTodo() {
  $("#card-list").empty()

  $.ajax({
    method: "GET",
    url: baseUrl + "todos",
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done((todo) => {
      console.log(todo);
      todo.forEach((element) => {
        $("#card-list").append(`
        <div class="col-6 mb-4">
          <div class="card border border-dark">
            <div class="card-body bg-success">
              <h3 class="card-title text-white">${element.title}</h3>
              <p class="card-text text-white">Description: ${element.description}</p>
              <p class="card-text text-white">Status: ${element.status}</p>
              <p class="card-text text-white">Due Date: ${element.due_date}</p>
              <a href="#" class="btn btn-warning text-white" onclick="getTodoById(${element.id})">Edit</a>
              <a href="#" class="btn btn-warning text-white" onclick="status(${element.id}, ${element.status})">Change Status</a>
              <a href="#" class="btn btn-warning text-white" onclick="remove(${element.id})">Delete</a>
            </div>
          </div>
        </div>
        `)
      })
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
}

function postTodo() {
  const title = $("#add-title").val()
  const description = $("#add-desc").val()
  const due_date = $("#add-date").val()

  $.ajax({
    method: "POST",
    url: baseUrl + "todos",
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      title,
      description,
      due_date
    }
  })
    .done((todo) => {
      auth()
      console.log(todo);
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always(_ => {
      $("#add-title").val("")
      $("#add-desc").val("")
      $("#add-date").val("")
    })
}

function getTodoById(id) {
  todoId = ""
  $("#submit-edit").show()
  $("#cancel-edit").show()
  $("#submit-add").hide()
  $("#edit-text").show()
  $("#add-text").hide()
  $.ajax({
    method: "GET",
    url: baseUrl + "todos/" + id,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done((data) => {
      $("#add-title").val(data.title)
      $("#add-desc").val(data.description)
      $("#add-date").val(data.due_date)
      todoId = id
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
}

function updateTodo() {
  const title = $("#add-title").val()
  const description = $("#add-desc").val()
  const due_date = $("#add-date").val()
  $.ajax({
    method: "PUT",
    url: baseUrl + "todos/" + todoId,
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      title,
      description,
      due_date
    }
  })
    .done(() => {
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always(_ => {
      $("#add-title").val("")
      $("#add-desc").val("")
      $("#add-date").val("")
    })
}

function status(id, statusId) {
  let status
  if (statusId === false) {
    status = true
  } else {
    status = false
  }
  $.ajax({
    method: "PATCH",
    url: baseUrl + "todos/" + id,
    headers: {
      token: localStorage.getItem("token")
    },
    data: {
      status
    }
  })
    .done((data) => {
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
}

function remove(id) {
  $.ajax({
    method: "DELETE",
    url: baseUrl + "todos/" + id,
    headers: {
      token: localStorage.getItem("token")
    }
  })
    .done((data) => {
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
}

$(document).ready(() => {
  auth()
  $("#form-signin").on("submit", (e) => {
    e.preventDefault()
    signin()
  })

  $("#logout").on("click", (e) => {
    e.preventDefault()
    logout()
  })

  $("#show-signup-form").on("click", (e) => {
    e.preventDefault()
    $("#container-user-signin").hide()
    $("#container-user-signup").show()
  })

  $("#form-signup").on("submit", (e) => {
    e.preventDefault()
    signup()
  })

  $("#cancel-signup-form").on("click", (e) => {
    e.preventDefault()
    auth()
  })

  $("#submit-add").click((e) => {
    e.preventDefault()
    postTodo()
  })

  $("#submit-edit").click((e) => {
    e.preventDefault()
    updateTodo()
  })

  $("#cancel-edit").click((e) => {
    e.preventDefault()
    auth()
    $("#add-title").val("")
    $("#add-desc").val("")
    $("#add-date").val("")
    $("#add-text").show()
  })
})