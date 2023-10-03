const toRead = [];
const RENDER_VIEW = "render-book";
let modeEditId;
let modeEditIndex;

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBuku");
  submitForm.addEventListener("submit", function (event) {
    addEditBook();
  });

  document
    .getElementById("inputSelesaiDibaca")
    .addEventListener("change", (event) => {
      if (event.currentTarget.checked) {
        document.getElementById("Status").innerText = "Selesai dibaca";
      } else {
        document.getElementById("Status").innerText = "Belum Selesai dibaca";
      }
    });
});

function addEditBook() {
  const judul = document.getElementById("inputJudulBuku").value;
  const penulis = document.getElementById("inputPenulis").value;

  const tahunTerbit = document.getElementById("inputTahunBuku").value;
  const isCompleted = document.getElementById("inputSelesaiDibaca").checked;

  if (modeEditId !== undefined) {
    toRead[modeEditIndex] = {
      ...modeEditId,
      title: judul,
      author: penulis,
      year: tahunTerbit,
      isCompleted: isCompleted,
    };

    document.dispatchEvent(new Event(RENDER_VIEW));
    saveData();
    modeEditId = "";
    modeEditIndex = "";
  } else {
    const id = generateId();
    const toReadObject = generateToReadObject(
      id,
      judul,
      penulis,
      tahunTerbit,
      isCompleted
    );
    toRead.push(toReadObject);

    document.querySelector(".inputOrEdit").innerText = "Masukkan Buku Baru";
    document.dispatchEvent(new Event(RENDER_VIEW));
    saveData();
  }
}

function generateId() {
  return +new Date();
}

function generateToReadObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_VIEW, function () {
  const incompletedToReadList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompletedToReadList.innerHTML = "";
  const completedToReadList = document.getElementById("completeBookshelfList");
  completedToReadList.innerHTML = "";

  for (const toReadItem of toRead) {
    const todoElement = makeToRead(toReadItem);
    if (!toReadItem.isCompleted) {
      incompletedToReadList.append(todoElement);
    } else {
      completedToReadList.append(todoElement);
    }
  }
});

function makeToRead(toReadObject) {
  const textJudul = document.createElement("h3");
  textJudul.classList.add("judulBuku");
  textJudul.innerText = toReadObject.title;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = "Penulis : " + toReadObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun : " + toReadObject.year;

  const hapus = document.createElement("button");
  hapus.classList.add("red");
  hapus.innerHTML = '<i class="fa-solid fa-trash"></i>';

  const edit = document.createElement("button");
  edit.classList.add("yellow");
  edit.innerHTML = '<i class="fa-solid fa-pen"></i>';

  const detailBook = document.createElement("div");
  detailBook.classList.add("detail");
  detailBook.append(textJudul, textPenulis, textYear);

  const Container = document.createElement("article");
  Container.classList.add("book_item");
  Container.setAttribute("data-aos", "zoom-in");
  Container.setAttribute("data-aos-duration", "1000");
  Container.setAttribute("id", `toRead-${toReadObject.id}`);
  Container.append(detailBook);

  edit.addEventListener("click", function () {
    editBook(toReadObject.id);
  });

  if (toReadObject.isCompleted) {
    const undoBook = document.createElement("button");
    undoBook.classList.add("green");
    undoBook.innerText = "Belum Selesai dibaca";

    undoBook.addEventListener("click", function () {
      undoBookCompleted(toReadObject.id);
    });

    hapus.addEventListener("click", function () {
      removeBook(toReadObject.id);
    });

    const tombolAction = document.createElement("div");
    tombolAction.classList.add("action");
    tombolAction.append(undoBook, hapus, edit);
    Container.append(tombolAction);
  } else {
    const finish = document.createElement("button");
    finish.classList.add("green");
    finish.innerText = "Selesai dibaca";

    finish.addEventListener("click", function () {
      addBookCompleted(toReadObject.id);
    });

    hapus.addEventListener("click", function () {
      removeBook(toReadObject.id);
    });

    const tombolAction = document.createElement("div");
    tombolAction.classList.add("action");
    tombolAction.append(finish, hapus, edit);
    Container.append(tombolAction);
  }
  return Container;
}

function addBookCompleted(toReadID) {
  const toReadTarget = findToRead(toReadID);

  if (toReadTarget == null) return;

  toReadTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_VIEW));
  saveData();
}

function editBook(toReadID) {
  const toReadTarget = findToRead(toReadID);
  if (toReadTarget == -1) return;
  const edit = toRead[findToReadIndex(toReadID)];

  document.getElementById("inputJudulBuku").value = edit.title;
  document.getElementById("inputPenulis").value = edit.author;
  document.getElementById("inputTahunBuku").value = edit.year;
  console.log("mode edit");

  modeEditId = edit;
  modeEditIndex = findToReadIndex(toReadID);

  console.log(modeEditId);

  if (edit.isCompleted == true) {
    document.getElementById("inputSelesaiDibaca").checked =
      modeEditId.isCompleted;
    document.getElementById("Status").innerText = "Selesai dibaca";
  }

  document.querySelector(".inputOrEdit").innerText = "Edit Buku";
}

function findToRead(toReadID) {
  for (const toReadItem of toRead) {
    if (toReadItem.id === toReadID) {
      return toReadItem;
    }
  }
  return null;
}

function removeBook(toReadID) {
  const toReadTarget = findToReadIndex(toReadID);
  let konfirmasiHapus = confirm("yakin nih pengen dihapus?");
  konfirmasiHapus;

  if (konfirmasiHapus) {
    if (toReadTarget === -1) return;
    toRead.splice(toReadTarget, 1);
    document.dispatchEvent(new Event(RENDER_VIEW));
    saveData();
  }
}

function undoBookCompleted(toReadID) {
  const toReadTarget = findToRead(toReadID);
  if (toReadTarget == null) return;

  toReadTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_VIEW));
  saveData();
}

function findToReadIndex(toReadID) {
  for (const index in toRead) {
    if (toRead[index].id === toReadID) {
      return index;
    }
  }

  return -1;
}

document
  .getElementById("cariSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const search = document.getElementById("cariJudul").value.toLowerCase();
    cariBuku(search);
  });

function cariBuku(todoTitle) {
  const listBook = document.querySelectorAll(".detail");

  for (book of listBook) {
    if (book.innerText.toLowerCase().includes(todoTitle)) {
      book.parentElement.style.display = "flex";
    } else {
      book.parentElement.style.display = "none";
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(toRead);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED));
  }
}

const SAVED = "saved-toread";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED, function () {
  alert("Data Berhasil Tersimpan");
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const toread of data) {
      toRead.push(toread);
    }
  }

  document.dispatchEvent(new Event(RENDER_VIEW));
}

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
