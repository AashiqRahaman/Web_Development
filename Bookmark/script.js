// Local Storage Helper
const STORAGE_KEY = "my_bookmarks_data";
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarksData));
}
function loadFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if(stored) {
    try {
      const d = JSON.parse(stored);
      if(Array.isArray(d)) return d;
    } catch{ }
  }
  // Example data if nothing stored yet
  return [
    {
      typeName: "College Essential",
      description: "Must-have resources for my college studies.",
      bookmarks: [
        {
          name: "Canvas",
          url: "https://canvas.instructure.com/",
          img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Canvas_logo.svg/300px-Canvas_logo.svg.png",
          description: "Online learning management system."
        },
        {
          name: "LeetCode",
          url: "https://leetcode.com/",
          img: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo.png",
          description: "Enhance your coding skills."
        }
      ]
    },
    {
      typeName: "AI websites",
      description: "AI chatbots and generative websites.",
      bookmarks: [
        {
          name: "Gemini",
          url: "https://gemini.google.com/",
          img: "https://avatars.githubusercontent.com/u/177682249?s=200&v=4",
          description: "Google's generative AI assistant"
        },
        {
          name: "Perplexity",
          url: "https://perplexity.ai/",
          img: "https://avatars.githubusercontent.com/u/108867401?s=200&v=4",
          description: "AI-powered search and answers"
        }
      ]
    }
  ];
}

function escapeHtml(str) {
  return (str||'').replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

let bookmarksData = loadFromStorage();

const bookmarkTypesContainer = document.getElementById('bookmarkTypesContainer');
const popupForm = document.getElementById('popupForm');
const formContent = document.getElementById('formContent');
const addTypeBtn = document.getElementById('addTypeBtn');
const darkToggle = document.getElementById('darkToggle');

//--- Dark Mode ---
let isDark = false;
function setDarkMode(dark) {
  isDark = dark;
  document.body.classList.toggle('dark', dark);
  darkToggle.innerText = dark ? "☀️ Light mode" : "🌙 Dark mode";
}
darkToggle.onclick = ()=> setDarkMode(!isDark);

//--- Render Function ---
function renderAll() {
  bookmarkTypesContainer.innerHTML = '';
  bookmarksData.forEach((type, idx) => {
    const typeDiv = document.createElement('div');
    typeDiv.className = "bookmark-type";
    typeDiv.setAttribute('data-type-idx', idx);

    const topBar = document.createElement('div');
    topBar.className = "type-top";
    topBar.innerHTML =
      `<span class="type-name">${escapeHtml(type.typeName)}</span>
       <div class="type-btns">
         <button class="info-btn" title="Show Description">ℹ️</button>
         <button title="Edit category">✏️</button>
         <button title="Delete category">🗑️</button>
         <button title="Add bookmark">+ Add</button>
       </div>`;
    const descSpan = document.createElement('span');
    descSpan.className = "type-desc";
    descSpan.innerText = type.description || "";
    typeDiv.appendChild(topBar);
    typeDiv.appendChild(descSpan);

    topBar.querySelector('.info-btn').onclick = () => {
      typeDiv.classList.toggle('show-desc')
      setTimeout(()=>typeDiv.classList.remove('show-desc'), 3200);
    };
    topBar.querySelectorAll('button')[1].onclick = () => showEditTypeForm(idx);
    topBar.querySelectorAll('button')[2].onclick = () => showDeleteType(idx);
    topBar.querySelectorAll('button')[3].onclick = () => showAddBookmarkForm(idx);

    const bookmarksList = document.createElement('div');
    bookmarksList.className = "bookmarks-list";
    type.bookmarks.forEach((bm, bIdx) => {
      // Card container
      const bmDiv = document.createElement('div');
      bmDiv.className = "bookmark-card";
      bmDiv.setAttribute('data-bm-idx', bIdx);

      // IMAGE & LINK
      const imageAnchor = document.createElement('a');
      imageAnchor.className = "bookmark-img-link";
      imageAnchor.href = bm.url;
      imageAnchor.target = "_blank";
      imageAnchor.rel = "noopener";
      imageAnchor.innerHTML = `<img class="bookmark-img" src="${escapeHtml(bm.img)}" alt="logo">`;

      bmDiv.appendChild(imageAnchor);

      // TITLE
      const titleRow = document.createElement('div');
      titleRow.className = "bookmark-title-row";
      titleRow.innerHTML = `<span class="bookmark-title">${escapeHtml(bm.name)}</span>`;
      bmDiv.appendChild(titleRow);

      // EDIT BUTTON (top right)
      const editBtn = document.createElement('button');
      editBtn.className = "bookmark-edit-btn";
      editBtn.title = "Edit bookmark";
      editBtn.innerHTML = "✏️";
      editBtn.onclick = (e) => {
        e.stopPropagation();
        showEditBookmarkForm(idx, bIdx);
      };
      bmDiv.appendChild(editBtn);

      bookmarksList.appendChild(bmDiv);
    });
    typeDiv.appendChild(bookmarksList);

    bookmarkTypesContainer.appendChild(typeDiv);
  });
  saveToStorage();
}

//--- Add/Edit/Delete Type ---
addTypeBtn.onclick = () => showAddTypeForm();
function showAddTypeForm() {
  showForm({
    title: 'Add Category',
    fields: [
      {label:'Name', name:'typeName', required:true},
      {label:'Description', name:'desc', type:'textarea', required:false},
    ],
    onSubmit: ({typeName, desc}) => {
      bookmarksData.push({
        typeName: typeName.trim(),
        description: desc.trim(),
        bookmarks: []
      });
      renderAll();
    }
  });
}
function showEditTypeForm(idx) {
  showForm({
    title:'Edit Category',
    fields: [
      {label:'Name', name:'typeName', required:true, value: bookmarksData[idx].typeName},
      {label:'Description', name:'desc', type:'textarea', required:false, value: bookmarksData[idx].description},
    ],
    onSubmit: ({typeName, desc}) => {
      bookmarksData[idx].typeName = typeName.trim();
      bookmarksData[idx].description = desc.trim();
      renderAll();
    },
    deleteBtn: {
      text: "Delete Category",
      onclick: () => {
        if (confirm("Delete this category and all its bookmarks?")) {
          bookmarksData.splice(idx,1);
          renderAll();
          hideForm();
        }
      }
    }
  });
}
function showDeleteType(idx) {
  if (confirm("Delete this category and all its bookmarks?")) {
    bookmarksData.splice(idx,1);
    renderAll();
  }
}

//--- Add/Edit/Delete Bookmark ---
function showAddBookmarkForm(typeIdx) {
  showForm({
    title:'Add Bookmark',
    fields:[
      {label:'Name', name:'name', required:true},
      {label:'Link (URL)', name:'url', required:true},
      {label:'Image Link', name:'img', required:true},
      {label:'Description', name:'desc', type:'textarea'}
    ],
    onSubmit: ({name, url, img, desc}) => {
      bookmarksData[typeIdx].bookmarks.push({
        name: name.trim(), url:url.trim(),
        img:img.trim(), description:desc.trim()
      });
      renderAll();
    }
  });
}
function showEditBookmarkForm(typeIdx, bmIdx) {
  let bm = bookmarksData[typeIdx].bookmarks[bmIdx];
  showForm({
    title:'Edit Bookmark',
    fields:[
      {label:'Name', name:'name', required:true, value: bm.name},
      {label:'Link (URL)', name:'url', required:true, value: bm.url},
      {label:'Image Link', name:'img', required:true, value: bm.img},
      {label:'Description', name:'desc', type:'textarea', value: bm.description}
    ],
    onSubmit: ({name, url, img, desc}) => {
      bm.name = name.trim();
      bm.url = url.trim();
      bm.img = img.trim();
      bm.description = desc.trim();
      renderAll();
    },
    deleteBtn: {
      text: "Delete Bookmark",
      onclick: () => {
        if (confirm("Delete this bookmark?")) {
          bookmarksData[typeIdx].bookmarks.splice(bmIdx,1);
          renderAll();
          hideForm();
        }
      }
    }
  });
}

//--- Form Popups ---
function showForm({title, fields, onSubmit, deleteBtn}) {
  formContent.innerHTML = `<h2 style="margin-bottom:1.1rem;">${escapeHtml(title)}</h2>`;
  fields.forEach(f=>{
    formContent.innerHTML +=
    `<label>${escapeHtml(f.label)}${f.required?" *":""}</label>` +
    (f.type==='textarea'
      ? `<textarea name="${f.name}" ${f.required?'required':''}>${escapeHtml(f.value||"")}</textarea>`
      : `<input name="${f.name}" value="${escapeHtml(f.value||"")}" ${f.required?'required':''}>`
    );
  });
  formContent.innerHTML +=
    `<div class="form-actions">
      <button class="close-btn" type="button">✖</button>
      <button type="submit">Save</button>
      ${deleteBtn ? `<button class="delete-btn" type="button">${escapeHtml(deleteBtn.text)}</button>` : ''}
    </div>`;
  popupForm.style.display = "";
  formContent.querySelector('.close-btn').onclick = hideForm;
  formContent.querySelector('button[type="submit"]').onclick = () => {
    let vals = {};
    fields.forEach(f=>{
      vals[f.name] = formContent.querySelector(
        `[name='${f.name}']`
      ).value;
    });
    if(fields.filter(f=>f.required).some(f=>!vals[f.name].trim())) {
      alert('Fill all required fields.');
      return;
    }
    hideForm();
    onSubmit(vals);
  };
  if (deleteBtn) {
    formContent.querySelector('.delete-btn').onclick = deleteBtn.onclick;
  }
}
function hideForm() {
  popupForm.style.display = "none";
  formContent.innerHTML = "";
}
popupForm.onclick = (e)=> {
  if(e.target===popupForm) hideForm();
};

//--- Initial Render ---
renderAll();

//--- Particle BG ----
const canvas = document.getElementById('particle-bg');
let ctx = canvas.getContext('2d');
let W = window.innerWidth, H = window.innerHeight;
canvas.width = W; canvas.height = H;
window.onresize = ()=>{
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W; canvas.height = H;
};
let mouse = {x:W/2, y:H/2};
window.onmousemove = (e)=>{
  mouse.x = e.clientX; mouse.y = e.clientY;
}
class Particle {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random()*2+1.6;
    this.dx = (Math.random()-0.5)*0.3;
    this.dy = (Math.random()-0.5)*0.3;
  }
  move(){
    this.x += this.dx + (mouse.x-W/2) * 0.00001;
    this.y += this.dy + (mouse.y-H/2) * 0.00001;
    if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
    ctx.fillStyle = isDark ? "#0be3e8bb" : "#54e0a6bb";
    ctx.fill();
  }
}
let particles = [];
let N = 63;
for(let i=0;i<N;++i) particles.push(new Particle());
function drawParticles(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{
    p.move();
    p.draw();
  });
  for(let i=0;i<N;++i)
    for(let j=i+1;j<N;++j){
      let dx = particles[i].x-particles[j].x;
      let dy = particles[i].y-particles[j].y;
      let dist = Math.sqrt(dx*dx+dy*dy);
      if(dist<140){
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.strokeStyle = isDark ? "#02e7da22" : "#81f5c422";
        ctx.lineWidth = 1.12;
        ctx.stroke();
      }
    }
  requestAnimationFrame(drawParticles);
}
drawParticles();
