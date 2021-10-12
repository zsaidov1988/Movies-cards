
// =============== Calling HTML elements ========================

var elContentDiv = $_('.js-content-div'); // Wrapper for card divs
var elSearchForm = $_('.js-search-form'); // Form for search movies
var elSearchInput = $_('.js-search-input', elSearchForm); // Input for search text
var elSearchModal = $_('.js-modal', elSearchForm); // div for match elements
var elSearchModalList = $_('.js-modal-list', elSearchForm); // ul for match elements
var elSearchResult = $_('.search-result'); // Element p for output count of search result
var elDivNavigator = $_('.js-navigator'); // Navigator for multipage
var alSOrtSelect = $_(".js-sort-select"); // Select for sort movies

var elMovieTemplate = $_('#js-movie-template').content; // Template for movie cards

// Create new normalazed Array for movies array
var normalazedMovies = movies.map(function (movie, i) {
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

// Function for search form
elSearchForm.addEventListener('submit', function (e) {
  e.preventDefault();

  var searchText = elSearchInput.value.trim(); // Value of search input
  if (searchText !== "") {
    renderMovieCard(sortMovies(parseInt(alSOrtSelect.value, 10)), searchText); // Generate some movie cards according to template with argument search text.
  }

});

renderMovieCard(normalazedMovies); // Generate all movie cards according to template
elSearchModal.style.display = "none";

// Function for search input. Event: oninput
elSearchInput.addEventListener('input', function () {
  var searchText = elSearchInput.value.trim(); // Value of search input
  elSearchModal.style.display = (searchText.length > 1) ? "block" : "none"; // Show or hide additional window for showing matching results
  elSearchModalList.innerHTML = ''; // Clear content of additional window
  var searchRegEx = new RegExp(searchText, 'gi');

  // Generate Matching results in additional window
  normalazedMovies.forEach(function (movie) {

    if (movie.title.match(searchRegEx)) {

      let itemLi = createElement('li', 'search-item', '', elSearchModalList); // Create li tag
      createElement('a', 'search-links', movie.title, itemLi); // Create a tag inside li tag with content title of movie

      itemLi.addEventListener('click', function () {
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

alSOrtSelect.addEventListener('change', function () {
  var searchText = elSearchInput.value.trim() || null; // Value of search input
  let sortType = parseInt(this.value, 10);
  renderMovieCard(sortMovies(sortType), searchText);
})