fetch('/api/ideas?page[number]=1&page[size]=10&append[]=small_image&append[]=medium_image&sort=-published_at')
  .then(res => res.json())
  .then(data => {
    console.log('Data dari API proxy:', data);
   
  });



let lastScrollY = window.scrollY;
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;

  const parallaxImage = document.querySelector('#ideas .parallax-image');
  const bannerContainer = document.querySelector('#ideas .parallax-banner-container');

  if (parallaxImage && bannerContainer) {
    const scrollPosition = window.scrollY;
    const bannerTop = bannerContainer.getBoundingClientRect().top + scrollPosition;
    const bannerHeight = bannerContainer.clientHeight;

    if (scrollPosition + window.innerHeight > bannerTop && scrollPosition < bannerTop + bannerHeight) {
      let offset = (scrollPosition - bannerTop) * 0.3;
      const maxParallaxMove = bannerHeight * 0.2;
      offset = Math.max(offset, -maxParallaxMove);
      offset = Math.min(offset, 0);
      parallaxImage.style.transform = `translateY(${offset}px)`;
    } else {
      parallaxImage.style.transform = `translateY(0px)`;
    }
  }
});


const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');

function showSection(sectionId) {
  contentSections.forEach(section => section.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionId) {
      link.classList.add('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  showSection('ideas');
  loadStateFromLocalStorage();
  renderIdeas();
});

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showSection(e.target.dataset.section);
  });
});


const ideasData = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  title: `Judul Ide Menarik ke-${i + 1} Dengan Kata yang Sangat Panjang Sekali`,
  date: new Date(2024, 0, 1 + i),
  excerpt: `Deskripsi singkat untuk ide ${i + 1}.`,
  image: `https://picsum.photos/seed/${i + 1}/400/300`
}));

const ideasGrid = document.querySelector('.ideas-grid');
const paginationContainer = document.querySelector('.pagination');
const showPerPageSelect = document.getElementById('showPerPage');
const sortBySelect = document.getElementById('sortBy');
const showingInfo = document.getElementById('showingInfo');

let currentPage = 1;

function saveStateToLocalStorage() {
  localStorage.setItem('ideasState', JSON.stringify({
    currentPage,
    showPerPage: showPerPageSelect.value,
    sortBy: sortBySelect.value
  }));
}

function loadStateFromLocalStorage() {
  const saved = localStorage.getItem('ideasState');
  if (saved) {
    const state = JSON.parse(saved);
    showPerPageSelect.value = state.showPerPage;
    sortBySelect.value = state.sortBy;
    currentPage = state.currentPage;
  }
}

function renderIdeas() {
  const showPerPage = parseInt(showPerPageSelect.value);
  const sortBy = sortBySelect.value;

  let sortedData = [...ideasData];
  if (sortBy === 'newest') {
    sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  const startIndex = (currentPage - 1) * showPerPage;
  const endIndex = startIndex + showPerPage;
  const visibleIdeas = sortedData.slice(startIndex, endIndex);

  ideasGrid.innerHTML = visibleIdeas.map(idea => `
    <div class="idea-card">
      <img src="${idea.image}" alt="Gambar Ide" loading="lazy">
      <div class="idea-card-content">
        <div class="idea-date">${idea.date.toDateString()}</div>
        <div class="idea-title">${idea.title}</div>
        <div class="idea-excerpt">${idea.excerpt}</div>
      </div>
    </div>
  `).join('');

  renderPagination(sortedData.length, showPerPage);
  showingInfo.textContent = `Menampilkan ${startIndex + 1} - ${Math.min(endIndex, sortedData.length)} dari ${sortedData.length} item`;
}

function renderPagination(totalItems, showPerPage) {
  const totalPages = Math.ceil(totalItems / showPerPage);
  paginationContainer.innerHTML = '';

  const createBtn = (text, page) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (page === currentPage) btn.classList.add('active');
    btn.disabled = page === currentPage;
    btn.addEventListener('click', () => {
      currentPage = page;
      saveStateToLocalStorage();
      renderIdeas();
    });
    return btn;
  };

  for (let i = 1; i <= totalPages; i++) {
    paginationContainer.appendChild(createBtn(i, i));
  }
}


showPerPageSelect.addEventListener('change', () => {
  currentPage = 1;
  saveStateToLocalStorage();
  renderIdeas();
});

sortBySelect.addEventListener('change', () => {
  currentPage = 1;
  saveStateToLocalStorage();
  renderIdeas();
});
