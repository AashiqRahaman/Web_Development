const addBtn = document.getElementById("addBtn");
const main = document.getElementById("main");

addBtn.addEventListener("click", () => addNote());

const saveNotes = () => {
  const notes = document.querySelectorAll(".note");
  const data = [];

  notes.forEach(note => {
    const title = note.querySelector(".note-title").value;
    const content = note.querySelector(".note-content").value;
    if (title.trim() || content.trim()) {
      data.push({ title, content });
    }
  });

  localStorage.setItem("notes", JSON.stringify(data));
};

const addNote = (content = "", title = "") => {
  const note = document.createElement("div");
  note.className = "note";
  note.innerHTML = `
        <div class="note-header">
          <span><b><i>Note</i></b></span>
          <div>
            <i class="save" title="Save"><img src="Resources/save.png" alt="img"></i> 
            <i class="Delete" title="Delete"><img src="Resources/trash.png" alt="img"></i> 
          </div>
        </div>
        <textarea class="note-title" placeholder="Title...">${title}</textarea>
        <textarea class="note-content" placeholder="Write your note...">${content}</textarea>
      `;

  const [saveBtn, trashBtn] = note.querySelectorAll(".note-header i");
  saveBtn.addEventListener("click", saveNotes);
  trashBtn.addEventListener("click", () => {
    note.remove();
    saveNotes();
  });

  main.appendChild(note);
  saveNotes();
};

const loadNotes = () => {
  const data = JSON.parse(localStorage.getItem("notes")) || [];
  data.forEach(note => addNote(note.content, note.title));
};

loadNotes();