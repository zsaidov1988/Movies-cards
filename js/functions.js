
//=================Functions======================

// Create card for movie according to template
const createMovieCard = (movie) => {
  const elCloneMovieTemplate = elMovieTemplate.cloneNode(true); // Clone template content to new variable
  const elCloneModalTemplate = elModalTemplate.cloneNode(true); // Clone modal template content to new variable

  // Edit some values of clone of template.
  $_('.js-movie-img', elCloneMovieTemplate).src = movie.imgUrl;
  $_('.js-movie-img', elCloneMovieTemplate).alt = movie.title;
  let movieTitle = movie.title;
  if (elSearchInput.value.trim() !== null && elSearchInput.value.trim() !== "") {
    let search = new RegExp(elSearchInput.value.trim(), 'gi');
    movieTitle = movieTitle.replace(search, `<mark class="own-mark">${movieTitle.match(search)}</mark>`);
  }
  $_('.js-movie-title', elCloneMovieTemplate).innerHTML = (movie.id + 1) + ". " + movieTitle;
  $_('.year-span', elCloneMovieTemplate).textContent = movie.year;
  $_('.category-span', elCloneMovieTemplate).textContent = movie.categories.join(", ");
  $_('.rating-span', elCloneMovieTemplate).textContent = movie.rating;

  // Buttons
  $_('.js-link-movie', elCloneMovieTemplate).href = `https://www.youtube.com/watch?v=${movie.youtubeId}`;
  $_('.js-more-btn', elCloneMovieTemplate).setAttribute("data-bs-target", `#more-btn-${movie.id}`);
  $_('.js-bookmark-btn', elCloneMovieTemplate).value = movie.id;

  // Modal Template
  $_(".js-modal-window", elCloneModalTemplate).id = `more-btn-${movie.id}`;
  $_(".js-modal-title", elCloneModalTemplate).textContent = movie.title;
  $_(".js-modal-summary", elCloneModalTemplate).textContent = movie.summary;
  $_(".js-modal-language", elCloneModalTemplate).textContent = movie.language;
  
  elCloneMovieTemplate.appendChild(elCloneModalTemplate);

  return elCloneMovieTemplate; // Return edited clone element
};

// Generate movie cards
const renderMovieCard = (moviesArr, page = 0) => {
  elContentDiv.innerHTML = ''; // Clear content of wrapper div for cards
  const fragment = document.createDocumentFragment();
  elSearchModal.style.display = "none"; // Hide additional window for matching search results
  let readyMoviesArr = []; // Array for movies 
  const search = elSearchInput.value.trim(); // Text in search input

  // Search movies
  if (search !== null && search !== "") { // Search input has some value
    const searchRegEx = new RegExp(search, 'gi'); // Create RegExp for search text
    readyMoviesArr = moviesArr.filter(function (movie) {
      return (movie.title.match(searchRegEx))
    });
  } else {
    readyMoviesArr = moviesArr; // Add all movie to new array
  }

  // Group by category
  if (elCategorySelect.value !== "all") {
    const searchRegExCategory = new RegExp(elCategorySelect.value, 'gi'); // Create RegExp for category
    readyMoviesArr = readyMoviesArr.filter(function (movie) {
      return (movie.categories.join(" ").match(searchRegExCategory))
    });
  }

  // Rating Limit
  if (elInputRating.value !== "" && !isNaN(parseFloat(elInputRating.value))) {
    const ratingBorder = parseFloat(elInputRating.value); // Min rating value
    readyMoviesArr = readyMoviesArr.filter(function (movie) {
      return (movie.rating >= ratingBorder);
    });
  }

  // Sort Array According to sort select
  const sortType = parseInt(elSortSelect.value, 10);
  if (sortType > 0) {
    readyMoviesArr = sortMovies(readyMoviesArr, sortType);
  }

  // Split array to pages
  const moviesOnPage = readyMoviesArr.slice(page * countCardsPerPage, page * countCardsPerPage + countCardsPerPage);

  moviesOnPage.forEach(function (movie) { // Add splitted array to HTML document
    fragment.appendChild(createMovieCard(movie));
  });

  elContentDiv.appendChild(fragment);
  elSearchResult.textContent = '';
  const count = readyMoviesArr.length;
  if (count > 0) {
    elSearchResult.textContent = `Found ${count} results`; // Show count of found movies according to search text

  } else if (count === 0 && search !== null) {
    elContentDiv.innerHTML = `<div class="d-flex align-items-center justify-content-center mt-5 mb-5"><h3>Not Found</h3></div>`;
  }

  // Create page navigator elements
  elDivNavigator.innerHTML = ''; // Clear old datas

  const countPages = Math.ceil(readyMoviesArr.length / countCardsPerPage); // Calculate count of pages

  if (countPages > 1) {
    for (let i = 0; i < countPages; i++) {
      const pageLink = createElement("a", "mx-1 link-page", i + 1, elDivNavigator); // Add a tag to page navigator
      pageLink.value = i; // Set value for a tag
      pageLink.addEventListener('click', function () {
        renderMovieCard(readyMoviesArr, this.value); // Generate link to according page
      });
    }
  }
}; // END renderMovieCard()

// Function for sort movies
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
// END sortMovies

const updateBookmarkList = () => {
  elBookmarkList.innerHTML = "";
  let localDatas = (localStorage.getItem("moviesId")) ? localStorage.getItem("moviesId").split(",") : [];
  if (localDatas.length > 0) {
    elBookmarkSection.classList.add("d-block");
    elBookmarkSection.classList.remove("d-none");
    localDatas.forEach((data) => {
      const itemLi = createElement("li", "mb-2 pb-2 border-bottom border-primary", "", elBookmarkList);
      const itemLink = createElement("a", "mx-4", normalazedMovies[parseInt(data)].title, itemLi);
      itemLink.href = `https://www.youtube.com/watch?v=${normalazedMovies[parseInt(data)].youtubeId}`;
      itemLink.setAttribute("target", "blank");
      const itemButton = createElement("button", "btn btn-danger", "Delete", itemLi);
      itemButton.value = normalazedMovies[parseInt(data)].id;
    });
  } else {
    elBookmarkSection.classList.add("d-none");
    elBookmarkSection.classList.remove("d-block");
  }

};

