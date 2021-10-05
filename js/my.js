
// =============== Calling HTML elements ========================

var elContentDiv = $_('.js-content-div'); // Wrapper for card divs
var elSearchForm = $_('.js-search-form'); // Form for search movies
var elSearchInput = $_('.js-search-input', elSearchForm); // Input for search text
var elSearchModal = $_('.js-modal', elSearchForm); // div for match elements
var elSearchModalList = $_('.js-modal-list', elSearchForm); // ul for match elements
var elSearchResult = $_('.search-result'); // Element p for output count of search result


var elMovieTemplate = $_('#js-movie-template').content; // Template for movie cards


// Function for search form
elSearchForm.addEventListener('submit', function (e) {
  e.preventDefault();

  var searchText = elSearchInput.value.trim(); // Value of search input
  if (searchText !== "") {
    renderMovieCard(searchText); // Generate some movie cards according to template with argument search text.
  }

});

renderMovieCard(); // Generate all movie cards according to template
elSearchModal.style.display = "none";


// Function for search input. Event: oninput
elSearchInput.addEventListener('input', function () {

  var searchText = elSearchInput.value.trim(); // Value of search input

  elSearchModal.style.display = (searchText.length > 1) ? "block" : "none"; // Show or hide additional window for showing matching results

  elSearchModalList.innerHTML = ''; // Clear content of additional window

  // Generate Matching results in additional window
  movies.forEach(function (movie) {

    if (String(movie.Title).toLowerCase().includes(searchText.toLowerCase())) {

      let itemLi = createElement('li', 'search-item', '', elSearchModalList); // Create li tag
      createElement('a', 'search-links', String(movie.Title), itemLi); // Create a tag inside li tag with content title of movie

      itemLi.addEventListener('click', function () {
        elSearchInput.value = String(movie.Title); // When click one of matching results, result assigned to value of search input 
        elSearchInput.focus();
        elSearchModal.style.display = "none"; // hide additional window 
      });
    }
  });

  if (elSearchModalList.innerHTML === '') { // Hide additional window if there is no matching results
    elSearchModal.style.display = "none";
  }

});