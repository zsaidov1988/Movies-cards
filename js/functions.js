
//=================Functions======================

// Create card for movie according to template
const createMovieCard = (movie) => {
  let elCloneMovieTemplate = elMovieTemplate.cloneNode(true); // Clone template content to new variable

  // Edit some values of clone of template.
  elCloneMovieTemplate.querySelector('.js-movie-img').src = movie.imgUrl;
  elCloneMovieTemplate.querySelector('.js-movie-img').alt = movie.title;
  elCloneMovieTemplate.querySelector('.js-movie-title').textContent = (movie.id + 1) + ". " + movie.title;
  elCloneMovieTemplate.querySelector('.year-span').textContent = movie.year;
  elCloneMovieTemplate.querySelector('.category-span').textContent = movie.categories.join(", ");
  elCloneMovieTemplate.querySelector('.rating-span').textContent = movie.rating;
  elCloneMovieTemplate.querySelector('.js-link-movie').href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;

  return elCloneMovieTemplate; // Return edited clone element
};

// Generate movie cards
const renderMovieCard = (moviesArr, page = 0) => {
  elContentDiv.innerHTML = ''; // Clear content of wrapper div for cards
  let fragment = document.createDocumentFragment();
  elSearchModal.style.display = "none"; // Hide additional window for matching search results
  let readyMoviesArr = []; // Array for movies 
  let search = elSearchInput.value.trim(); // Text in search input
  console.log(search);
  // Search movies
  if (search !== null && search !== "") { // Search input has some value
    let searchRegEx = new RegExp(search, 'gi'); // Create RegExp for search text
    readyMoviesArr = moviesArr.filter(function (movie) {
      return (movie.title.match(searchRegEx))
    });
  } else {
    readyMoviesArr = moviesArr; // Add all movie to new array
  }

  // Group by category
  if (elCategorySelect.value !== "all") {
    let searchRegExCategory = new RegExp(elCategorySelect.value, 'gi'); // Create RegExp for category
    readyMoviesArr = readyMoviesArr.filter(function (movie) {
      return (movie.categories.join(" ").match(searchRegExCategory))
    });
  }

  // Rating Limit
  if (elInputRating.value !== "" && !isNaN(parseFloat(elInputRating.value))) {
    let ratingBorder = parseFloat(elInputRating.value); // Min rating value
    readyMoviesArr = readyMoviesArr.filter(function (movie) {
      return (movie.rating >= ratingBorder);
    });
  }

  // Sort Array According to sort select
  let sortType = parseInt(elSortSelect.value, 10);
  if (sortType > 0) {
    readyMoviesArr = sortMovies(readyMoviesArr, sortType);
  }

  // Split array to pages
  let moviesOnPage = readyMoviesArr.slice(page * 24, page * 24 + 24);

  moviesOnPage.forEach(function (movie) { // Add splitted array to HTML document
    fragment.appendChild(createMovieCard(movie));
  });

  elContentDiv.appendChild(fragment);
  elSearchResult.textContent = '';
  let count = readyMoviesArr.length;
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
        renderMovieCard(readyMoviesArr, this.value); // Generate link to according page
      });
    }
  }
}; // END renderMovieCard()

const sortMovies = (sortedArray, sortType) => {
  switch (sortType) {
    case 0:
      break;
    case 1:
      sortedArray.sort((a, b) => a.title > b.title && 1 || -1);
      break;
    case 2:
      sortedArray.sort((a, b) => a.title < b.title && 1 || -1);
      break;
    case 3:
      sortedArray.sort((a, b) => b.year - a.year);
      break;
    case 4:
      sortedArray.sort((a, b) => a.year - b.year);
      break;
    case 5:
      sortedArray.sort((a, b) => b.rating - a.rating);
      break;
    case 6:
      sortedArray.sort((a, b) => a.rating - b.rating);
      break;
  }
  return sortedArray;
};

