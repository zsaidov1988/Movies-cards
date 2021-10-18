// =============== CONST VARIABLES ===========================

const countCardsPerPage = 12;



// =============== Calling HTML elements ========================

const elContentDiv = $_('.js-content-div'); // Wrapper for card divs
const elSearchForm = $_('.js-search-form'); // Form for search movies
const elSearchInput = $_('.js-search-input', elSearchForm); // Input for search text
const elSearchModal = $_('.js-modal', elSearchForm); // div for match elements
const elSearchModalList = $_('.js-modal-list', elSearchForm); // ul for match elements
const elSortSelect = $_(".js-sort-select", elSearchForm); // Select for sort movies
const elInputRating = $_(".js-rating-input", elSearchForm); // Input for rating
const elCategorySelect = $_(".js-categories-select", elSearchForm); // Select for category
const elSearchResult = $_('.search-result'); // Element p for output count of search result
const elDivNavigator = $_('.js-navigator'); // Navigator for multipage
const elModalTitleHeading = $_(".js-modal-title"); // h5 title of modal window
const elModalBody = $_(".js-modal-body"); // div body of modal window

const elMovieTemplate = $_('#js-movie-template').content; // Template for movie cards

// Create new normalazed Array for movies array
let normalazedMovies = movies.map((movie, i) => {
  return {
    id: i,
    title: movie.Title.toString(),
    year: movie.movie_year,
    categories: movie.Categories.split("|"),
    imgUrl: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`,
    rating: movie.imdb_rating,
    youtubeId: movie.ytid,
  };
});

renderMovieCard(normalazedMovies); // Generate all movie cards according to template
elSearchModal.style.display = "none";

// Generate Array of categories
// Generate Category select options
let movieCategories = [];
normalazedMovies.forEach((movie) => {
  movie.categories.forEach((category) => {
    if (!movieCategories.includes(category)) {
      movieCategories.push(category);
    }
  });
});
movieCategories.sort();

let documentFragment = document.createDocumentFragment();
movieCategories.forEach((category) => {
  let newOptionElement = createElement('option', '', category, documentFragment);
  newOptionElement.value = category.toLowerCase();
});

elCategorySelect.appendChild(documentFragment);


/************************
****EVENT LISTENERS******
************************/

// Function for search form
elSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let searchText = elSearchInput.value.trim(); // Value of search input
  if (searchText !== "") {
    renderMovieCard(normalazedMovies); // Generate some movie cards according to template with argument search text.
  }
});

// Function for search input. Event: oninput
elSearchInput.addEventListener('input', () => {
  let searchText = elSearchInput.value.trim(); // Value of search input
  elSearchModal.style.display = (searchText.length > 1) ? "block" : "none"; // Show or hide additional window for showing matching results
  elSearchModalList.innerHTML = ''; // Clear content of additional window
  let searchRegEx = new RegExp(searchText, 'gi');

  // Generate Matching results in additional window
  normalazedMovies.forEach((movie) => {

    if (movie.title.match(searchRegEx)) {

      let itemLi = createElement('li', 'search-item', '', elSearchModalList); // Create li tag
      createElement('a', 'search-links', movie.title, itemLi); // Create a tag inside li tag with content title of movie

      itemLi.addEventListener('click', () => {
        elSearchInput.value = movie.title; // When click one of matching results, result assigned to value of search input
        elSearchInput.focus();
        elSearchModal.style.display = "none"; // hide additional window 
      });
    }
  });
  if (elSearchModalList.innerHTML === '') { // Hide additional window if there is no matching results
    elSearchModal.style.display = "none";
  }
});

// Event for sort select
elSortSelect.addEventListener('change', () => {
  renderMovieCard(normalazedMovies);
});

//Event for Category select
elCategorySelect.addEventListener("change", () => {
  renderMovieCard(normalazedMovies);
});

//Event for Rating Limit
elInputRating.addEventListener("change", () => {
  renderMovieCard(normalazedMovies);
});

// Event for buttons more and bookmark
elContentDiv.addEventListener("click", (e) => {
  if (e.target.className === 'btn btn-info js-more-btn') {
    elModalTitleHeading.value = e.target.value;
  }
  if (e.target.className === 'btn btn-primary js-bookmark-btn') {
    console.log(e.target.value);
  }
});