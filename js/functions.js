
//=================Functions======================

// Create card for movie according to template
const createMovieCard = (movie) => {
  let elCloneMovieTemplate = elMovieTemplate.cloneNode(true); // Clone template content to new variable

  // Edit some values of clone of template.
  elCloneMovieTemplate.querySelector('.js-movie-img').src = "https://via.placeholder.com/150x100";
  elCloneMovieTemplate.querySelector('.js-movie-img').alt = movie.title;
  elCloneMovieTemplate.querySelector('.js-movie-title').textContent = (movie.id + 1) + ". " + movie.title;
  elCloneMovieTemplate.querySelector('.year-span').textContent = movie.year;
  elCloneMovieTemplate.querySelector('.category-span').textContent = movie.categories.join(", ");
  elCloneMovieTemplate.querySelector('.rating-span').textContent = movie.rating;
  elCloneMovieTemplate.querySelector('.js-link-movie').href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;

  return elCloneMovieTemplate; // Return edited clone element
};

// Generate movie cards
const renderMovieCard = (moviesArr, search = null, page = 0, count = 0) => {
  elContentDiv.innerHTML = ''; // Clear content of wrapper div for cards
  let fragment = document.createDocumentFragment();
  elSearchModal.style.display = "none"; // Hide additional window for matching search results
  let readyMoviesArr = []; // Array for movies 

  if (search !== null && search !== "") { // Search input has some value
    let searchRegEx = new RegExp(search, 'gi'); // Create RegExp for search text
    moviesArr.forEach(function (movie) {
      if (movie.title.match(searchRegEx) || movie.categories.join(" ").match(searchRegEx)) {
        count++;
        readyMoviesArr.push(movie); // Add searched movie to new array
      }
    });
  } else {
    readyMoviesArr = moviesArr; // Add all movie to new array
  }

  let moviesOnPage = readyMoviesArr.slice(page * 24, page * 24 + 24); // Split array to pages

  moviesOnPage.forEach(function (movie) { // Add splitted array to HTML document
    fragment.appendChild(createMovieCard(movie));
  });

  elContentDiv.appendChild(fragment);
  elSearchResult.textContent = '';

  if (count > 0) {
    elSearchResult.textContent = `Found ${count} results`; // Show count of found movies according to search text

  } else if (count === 0 && search !== null) {
    elContentDiv.innerHTML = `<div class="d-flex align-items-center justify-content-center mt-5 mb-5"><h3>Not Found</h3></div>`;
  }

  // Create page navigator elements
  elDivNavigator.innerHTML = ''; // Clear old datas

  var countPages = Math.ceil(readyMoviesArr.length / 24); // Calculate count of pages

  if (countPages > 1) {
    for (var i = 0; i < countPages; i++) {
      var pageLink = createElement("a", "mx-1 link-page", i + 1, elDivNavigator); // Add a tag to page navigator
      pageLink.value = i; // Set value for a tag
      pageLink.addEventListener('click', function () {
        renderMovieCard(readyMoviesArr, null, this.value, count); // Generate link to according page
      });
    }
  }

}; // END renderMovieCard()

