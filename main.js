const API = "http://localhost:8000/todos";

let inpAdd = document.getElementById("inp-add");
let btnAdd = document.getElementById("btn-add");
let list = document.getElementById("list");
let inpTodo = document.getElementById("inp-edit-todo");
let inpId = document.getElementById("inp-edit-id");
let btnSave = document.getElementById("btn-save-edit");
let inpSearch = document.getElementById("inp-search");
const pag = document.getElementById("pagination");
let page = 1;
inpAdd.addEventListener("keydown", function (e) {
  console.log(e);
  if (e.code === "Enter") {
    addTodo();
  }
});
inpSearch.addEventListener("input", function () {
  getTodos();
});
// console.log(inpAdd, btnAdd);
btnAdd.addEventListener("click", addTodo);
async function addTodo() {
  let newTodo = {
    todo: inpAdd.value,
  };
  if (newTodo.todo.trim() === "") {
    alert("заполните поле");
    return;
  }
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  inpAdd.value = "";
  getTodos();
}
async function getTodos() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=2`
  )
    .then(res => res.json())
    .catch(err => console.log(err));
  console.log(response);
  list.innerHTML = "";
  response.forEach(element => {
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.innerHTML = `<span>${element.todo}</span><button class="btn-delete">Delete</button>
    <button class="btn-edit">edit</button>`;
    list.append(newElem);
  });
  let allTodos = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err));
  let lastPage = Math.ceil(allTodos.length / 2);
  // console.log(lastPage);
  pag.innerHTML = `
    <button ${page === 1 ? "disabled" : ""} id="btn-prev">prev</button>
    <span>${page}</span>
    <button ${page === lastPage ? "disabled" : ""} id="btn-next">next</button>
  `;
}
getTodos();
let modalEdit = document.getElementById("modal-edit");
let btnClose = document.getElementById("modal-edit-close");
btnClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});
document.addEventListener("click", async function (e) {
  if (e.target.className === "btn-delete") {
    let id = e.target.parentNode.id;
    await fetch(API + "/" + id, {
      method: "DELETE",
    });
    getTodos();
  }
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;

    let result = await fetch(API + "/" + id)
      .then(res => res.json())
      .catch(err => console.log(err));
    // console.log(result);
    inpTodo.value = result.todo;
    inpId.value = result.id;
  }
  if (e.target.id === "btn-prev") {
    page--;
    getTodos();
  }
  if (e.target.id === "btn-next") {
    page++;
    getTodos();
  }
});

btnSave.addEventListener("click", async function () {
  let editedTodo = { todo: inpTodo.value };
  let id = inpId.value;
  if (editedTodo.todo.trim() === "") {
    alert("заполните поле");
    return;
  }
  await fetch(API + "/" + id, {
    method: "PATCH",
    body: JSON.stringify(editedTodo),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  modalEdit.style.display = "none";
  getTodos();
});
