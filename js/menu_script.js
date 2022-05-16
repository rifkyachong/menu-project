// local database
const menuDatabase = [
{
  id: 1,
  name: "Nasi Goreng",
  category: "makanan",
  price: 32000,
  img: "../database/img/nasi-goreng.jpg" ,
  detail: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eius, ",
}, 
{
  id: 2,
  name: "Perkedel Kentang",
  category: "makanan",
  price: 22000,
  img: "../database/img/perkedel-kentang.jpg" ,
  detail: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eius, ",
}, 
{
  id: 3,
  name: "Siomay Daging",
  category: "makanan",
  price: 28000,
  img: "../database/img/siomay-daging.jpeg" ,
  detail: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eius, ",
}, 
{
  id: 4,
  name: "Teh Manis",
  category: "minuman",
  price: 7000,
  img: "../database/img/teh-manis.jpg" ,
  detail: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eius, ",
}, 
{
  id: 5,
  name: "Es Jeruk",
  category: "minuman",
  price: 11000,
  img: "../database/img/es-jeruk.png" ,
  detail: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit eius, ",
}]

// global variable
const listofCategories = menuDatabase.reduce(function(categories, menuItem) {
  if(!categories.includes(menuItem.category)) {
    categories.push(menuItem.category); 
  } 
  return categories;
}, ['all']);
let filterBtnBar = document.querySelector('div.category-bar');
let pageBtnBar = document.querySelector('div.page-btn-bar');
let listofArticle;
let displayedArticles;
let limit = 10;
let currentIndex;
let menuSection = document.querySelector('div.menu-section');
let blurFilter = document.querySelector('.filter-blur');
let modalBox = document.querySelector('.modalbox-overlay');
let searchBox = document.getElementById('search-menu');
let searchIcon = document.getElementById('search-icon');
let noMatchInfo = document.querySelector('.info');


window.addEventListener('DOMContentLoaded', function() {
  createCategoryBtn();
  loadAll();
  createSearchEngine();
  window.addEventListener('resize', refreshReadMore);
})


const createCategoryBtn = function() {
  //create button dynamically
  let listofBtn = listofCategories.map( function(category) {
    return `<button class="btn btn-sm category-btn" ctgry-id="${category}">${category.charAt(0).toUpperCase()+category.slice(1)}</button>`;
  });
  filterBtnBar.innerHTML = listofBtn.join('');
  listofBtn = document.querySelectorAll('button.category-btn');
  
  //create event listener for every buttons
  listofBtn[0].addEventListener('click', loadAll);
  listofBtn = document.querySelectorAll('button.category-btn:not(:first-child');
  listofBtn.forEach( (btn) => {
    btn.addEventListener('click', filterByCategory);
  })
}

const createSearchEngine = function() {
  searchBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      filterBySearchValue(searchBox.value);
    }
  });

  searchIcon.addEventListener('click', function() {
    filterBySearchValue(searchBox.value);
  });
}

const addMenuArticle = function(menuItem) {
  return `<article class="menu-article" id="${idFormat(menuItem.name)}">
  <img class="menu-image" src="${menuItem.img}">
  <div class="menu-description">
    <div class="menu-header">
      <div class="menu-name">${menuItem.name}</div>
      <div class="menu-price">${rupiahFormat(menuItem.price)}</div>
    </div>
    <div class="menu-detail">${menuItem.detail}</div>
  </div>
  <div class="read-more"><span>read more</span></div>
</article>`;
}

const filterByCategory = function(e) {
  let category = e.currentTarget.getAttribute('ctgry-id');
  listofArticle = menuDatabase.reduce( function(filtered, menuItem) {
    if (menuItem.category === category) {
      filtered.push(addMenuArticle(menuItem));
    }
    return filtered;
  }, []);

  let listofBtn = document.querySelectorAll('button.category-btn');
  listofBtn.forEach( (btn) => {
    btn.classList.remove('selected');
  })
  let selectedBtn = e.currentTarget;
  selectedBtn.classList.add('selected');

  noMatchInfo.classList.remove('show');

  let numofPage = Math.ceil(listofArticle.length / limit);
  createPageBtn(numofPage);
  
  document.querySelector('button.page-btn').click();
} 

const filterBySearchValue = function(value) {
  if (!/\w/.test(value)) {
    window.alert('search input should not empty!!');
    return;
  }
  let regExp = "(\\b" + value.trim().toLowerCase().replace(/\s+/g, "|\\b") + ")"
  regExp = new RegExp(regExp, 'i'); 
  console.log(regExp);

  listofArticle = menuDatabase.reduce( function(filtered, menuItem) {
    if (regExp.test(menuItem.name)) {
      filtered.push(addMenuArticle(menuItem));
    }
    return filtered;
  }, []);

  searchBox.value = "";
  let listofBtn = document.querySelectorAll('button.category-btn');
  listofBtn.forEach( (btn) => {
    btn.classList.remove('selected');
  });

  if (listofArticle.length === 0) {
    menuSection.innerHTML = "";
    noMatchInfo.classList.add('show');
  }
  else {
    noMatchInfo.classList.remove('show');
    let numofPage = Math.ceil(listofArticle.length / limit);
    createPageBtn(numofPage);
    document.querySelector('button.page-btn').click();
  } 
}

const loadAll = function() {
  listofArticle = menuDatabase.map(addMenuArticle);

  let listofBtn = document.querySelectorAll('button.category-btn');
  listofBtn.forEach( (btn) => {
    btn.classList.remove('selected');
  })
  let selectedBtn = document.querySelector('button.category-btn');
  selectedBtn.classList.add('selected');

  noMatchInfo.classList.remove('show');
  let numofPage = Math.ceil(listofArticle.length / limit);
  createPageBtn(numofPage);
  
  document.querySelector('button.page-btn').click();
}

const createPageBtn = function(numofBtn) {
  let range = Array.from(Array(numofBtn).keys()).map(x => x+1);
  let listofBtn = range.map( (pageNum) => {
    return `<button class="btn page-btn" page-id="${pageNum}">${pageNum}</button>`;
  })
  pageBtnBar.innerHTML = listofBtn.join(' ');
  
  listofBtn = document.querySelectorAll('button.page-btn');
  listofBtn.forEach( (btn) => {
    btn.addEventListener('click', movePage)
  })
}

const movePage = function(e) {
  let currentPage = parseInt(e.currentTarget.getAttribute("page-id"));
  currentIndex = (currentPage - 1) * limit;

  let listofBtn = document.querySelectorAll('button.page-btn');
  listofBtn.forEach( (btn) => {
    btn.classList.remove('selected');
  })
  let selectedBtn = e.currentTarget;
  selectedBtn.classList.add('selected');

  displayedArticles = listofArticle.slice(currentIndex, currentIndex + limit);
  menuSection.innerHTML = displayedArticles.join('');
  displayedArticles = document.querySelectorAll('.menu-article');

  let readMoreBtns = document.querySelectorAll('.read-more');
  readMoreBtns.forEach( (btn) => {
    btn.addEventListener('click', openModal )
  })
  refreshReadMore();
}

const openModal = function(e) {
  let selectedMenu = e.currentTarget.parentElement;
  console.log(selectedMenu);
  refreshModal(selectedMenu);
  modalBox.classList.replace('hidden', 'opening');
  blurFilter.classList.replace('hidden', 'opening');
  modalBox.addEventListener('animationend', function removeHidden(){
    modalBox.classList.remove('opening');
    modalBox.removeEventListener('animationend', removeHidden);
    modalBox.querySelector('#exit-btn').addEventListener('click', closeModal);
  })
  blurFilter.addEventListener('animationend', function removeHidden(){
    blurFilter.classList.remove('opening');
    blurFilter.removeEventListener('animationend', removeHidden);
  })
}

const refreshModal = function(selectedMenu) {
  modalBox.querySelector('.modal-image').src = selectedMenu.querySelector('.menu-image').src;
  modalBox.querySelector('.menu-name').textContent = selectedMenu.querySelector('.menu-name').textContent;
  modalBox.querySelector('.menu-price').textContent = selectedMenu.querySelector('.menu-price').textContent;
  modalBox.querySelector('.modal-detail').textContent = selectedMenu.querySelector('.menu-detail').textContent;
}

const closeModal = function() {
  modalBox.classList.add('closing');
  blurFilter.classList.add('closing');
  modalBox.addEventListener('animationend', function addHidden(){
    modalBox.classList.replace('closing', 'hidden');
    modalBox.removeEventListener('animationend', addHidden);
  })
  blurFilter.addEventListener('animationend', function addHidden(){
    blurFilter.classList.replace('closing', 'hidden');
    blurFilter.removeEventListener('animationend', addHidden);
  })
}

const refreshReadMore = function() {
  for (let i = 0; i < displayedArticles.length; i++) {
    let articleHeight = displayedArticles[i].clientHeight;
    let descriptionHeight = displayedArticles[i].querySelector('.menu-description').clientHeight;
    let thisReadMore = displayedArticles[i].querySelector('.read-more');
    if (articleHeight < descriptionHeight) {
      thisReadMore.classList.remove('hidden');
      thisReadMore.classList.add('show');
    }
    else {
      thisReadMore.classList.remove('show');
      thisReadMore.classList.add('hidden');
    }
  }
}

const rupiahFormat = function(price) {
  let result = "Rp";
  if (typeof price === 'number') price = price.toString();
  if (/\D/.test(price)) return "NaN";
  let i = price.length % 3;
  if (i === 0) i = 3;
  result += price.substr(0, i);
  while (i < price.length) {
    result += '.' + price.substr(i, 3);
    i += 3;
  }
  result += ',-';
  return result;
}

const idFormat = function(name) {
  return name.toLowerCase().trim().replace(/\s+/g, "-");
}


//create button
//   let listofBtn = listofCategories.map(function(category) {
//     return `<button class="btn btn-sm category-btn" id="${category}">${category.charAt(0).toUpperCase()+category.slice(1)}</button>`;
//   });
//   filterBtnBar.innerHTML = listofBtn.join("");
//   //create listener of each button
//   let allCategoryBtn = filterBtnBar.querySelectorAll('.category-btn');
//   allCategoryBtn.forEach((btn) => {
//     btn.addEventListener('click', (e) => {
//       filterByCategory(e, database)
//     })
//   }) 


// // global variable
// let menuSection = document.querySelector('div.menu-section');
// let filterBtnBar = document.querySelector('nav.category-bar');


// console.log('global variable terbaca');


// window.addEventListener('DOMContentLoaded', function() {
//   loadAllMenu(menuDatabase);
//   createFilterBtn(menuDatabase);
//   console.log('listener terbaca');
// })


// // function








// const loadAllMenu = function(database) {
//   let menuArticles = database.map(addMenuArticle);
//   menuSection.innerHTML = menuArticles.join("");
//   let readmoreBtns = menuSection.querySelectorAll('.read-more')
//   readmoreBtns.forEach((btn) => {
//     btn.addEventListener('click', openModal);
//   })
// }

// const createFilterBtn = function(database) {
//   //create list of categories in an array
//   let listofCategories = database.reduce(function(categories, menuItem) {
//     if(!categories.includes(menuItem.category)) {
//       categories.push(menuItem.category); 
//     } 
//     return categories;
//   }, ['all']);
//   console.log(listofCategories);
  
//   //create button
//   let listofBtn = listofCategories.map(function(category) {
//     return `<button class="btn btn-sm category-btn" id="${category}">${category.charAt(0).toUpperCase()+category.slice(1)}</button>`;
//   });
//   filterBtnBar.innerHTML = listofBtn.join("");
//   //create listener of each button
//   let allCategoryBtn = filterBtnBar.querySelectorAll('.category-btn');
//   allCategoryBtn.forEach((btn) => {
//     btn.addEventListener('click', (e) => {
//       filterByCategory(e, database)
//     })
//   }) 
// }

// const filterByCategory = function(e, database) {
//   let category = e.currentTarget.id;
//   console.log(category);
//   database = database.filter( (menuItem) => {
//     return menuItem.category === category;
//   });
//   let menuArticles = database.map(addMenuArticle);
//   menuSection.innerHTML = menuArticles.join("");
//   let readmoreBtns = menuSection.querySelectorAll('.read-more')
//   readmoreBtns.forEach((btn) => {
//     btn.addEventListener('click', openModal);
//   });
// }

// const refreshReadMore = function() {
//   for (let i = 0; i < allMenu.length; i++) {
//     let articleHeight = allMenu[i].clientHeight;
//     let descriptionHeight = allMenu[i].querySelector('.menu-description').clientHeight;
//     let thisReadMore = allMenu[i].querySelector('.read-more');
//     if (articleHeight < descriptionHeight) {
//       thisReadMore.classList.remove('hidden');
//       thisReadMore.classList.add('show');
//     }
//     else {
//       thisReadMore.classList.remove('show');
//       thisReadMore.classList.add('hidden');
//     }
//   }
// }


// window.addEventListener('resize', refreshReadMore);


// const test = function() {
//   console.log('function called!!');
// }

