
//=================Functions======================

// Create card for movie according to template
const createMovieCard = (movie) => {
  let elCloneMovieTemplate = elMovieTemplate.cloneNode(true); // Clone template content to new variable

  // Edit some values of clone of template.
  elCloneMovieTemplate.querySelector('.js-movie-img').src = "https://via.placeholder.com/150x100";
  elCloneMovieTemplate.querySelector('.js-movie-img').alt = movie.Title;
  elCloneMovieTemplate.querySelector('.js-movie-title').textContent = movie.Title;
  elCloneMovieTemplate.querySelector('.year-span').textContent = movie.movie_year;
  elCloneMovieTemplate.querySelector('.category-span').textContent = movie.Categories.split('|').join(", ");
  elCloneMovieTemplate.querySelector('.rating-span').textContent = movie.imdb_rating;
  elCloneMovieTemplate.querySelector('.js-link-movie').href = `https://www.youtube.com/watch?v=${movie.ytid}`;

  return elCloneMovieTemplate; // Return edited clone element
};

// Generate movie cards
const renderMovieCard = (search = null) => {
  elContentDiv.innerHTML = ''; // Clear content of wrapper div for cards
  let fragment = document.createDocumentFragment();
  let count = 0; // Counter for search results
  elSearchModal.style.display = "none"; // Hide additional window for matching search results

  movies.forEach(function (movie) { // Loop for movies array

    if (search === null || search === "") { // Show all movies
      fragment.appendChild(createMovieCard(movie));
    } else if (String(movie.Title).toLowerCase().includes(search.toLowerCase()) || movie["Categories"].toLowerCase().includes(search.toLowerCase())) {
      fragment.appendChild(createMovieCard(movie)); // Show searched movies
      count++;
    }
  });

  elContentDiv.appendChild(fragment);
  elSearchResult.textContent = '';

  if (count === 1) {
    elSearchResult.textContent = `Found ${count} result`; // Show count of found movies according to search text
  }
  else if (count > 1) {
    elSearchResult.textContent = `Found ${count} results`; // Show count of found movies according to search text
  } else if (count === 0 && search !== null) {
    elSearchResult.textContent = `There are no matches`;
  }

};

