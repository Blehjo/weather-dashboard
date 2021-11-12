//click on search bar and get data from it
var containerList = document.getElementById('search-results');
var recipeContainer = document.querySelector('.recipe-display');

//searchResults page + extra recipe detail variables
var displayRecipeImage;
var displayRecipeHeading;
var displayRecipeUnorderedList;
var displayIngredients;
var displayRecipeVideo;
var recipeSearchResultContainer;
var recipeSearchResultImage;
var recipeSearchResultHeadings;
var recipeSearchResultButton;
var cardImage = document.querySelectorAll('.card-image');
var cardContent = document.querySelectorAll('.card-content');
var cardAction = document.querySelectorAll('.card-action');
var recipeImage = document.querySelector('.recipe-image');
var recipeContent = document.querySelector('.recipe-content');

// recipe-search-button - event listener for the click
var fetchButton = document.getElementById('recipe-search-button');

// recipe-search-input - to get the value
var recipeSearchInput = document.getElementById('recipe-search-input');

//Local storage element to append to
var historyEl = document.querySelector('.search-history');

//local storage get item
var gettingItem = JSON.parse(localStorage.getItem('food')) || [];

//Clear the search input value on page load
recipeSearchInput.value = '';
//local storage function to set item
var set = function(){
  var food = [recipeSearchInput.value];

  gettingItem.push(food);
  console.log(gettingItem);
  localStorage.setItem('food', JSON.stringify(gettingItem));
}

//Display local storage
var listing = function(){
  historyEl.innerHTML = '';
  var searchLength = gettingItem.length;
  if(gettingItem.length >= 3){
    searchLength = 3;
  }
  for(var i = 0; i < searchLength; i++){
      var list = document.createElement('ul');
      list.innerHTML = `<ol>${gettingItem[gettingItem.length - i - 1]}</ol>`;
      historyEl.append(list);
  }
}
//getApi function is called when the fetchButton is clicked
function getApi(e) {
  e.preventDefault();
  // Insert the API url to get a list of your repos
  var requestUrl = `https://api.edamam.com/search?q=${recipeSearchInput.value}&app_id=46923f1d&app_key=5e710e80302e239cd7c90b4b531dd159&from=1&to=7`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data = data.hits
      searchReults(data);
      set();
      listing();
      recipeSearchInput.value = '';
    });
}

//fetch for youtube API
function youtubeAPI(data) {
  var youtubeHeading = data.recipe.label;
  var youtubeUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${youtubeHeading}&key=AIzaSyDIguCz_5VxSSQ_HIouV7kqUS4rNjWoi0A`;

  fetch(youtubeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayYoutubeVideos(data);
    })
}

//Displays the search results data on the page 
function searchResults(data) {
  containerList.classList.remove('hidden');

  for (var i = 0; i < data.length; i++) {
    cardImage[i].innerHTML = '';
    cardContent[i].innerHTML = '';
    cardAction[i].innerHTML = '';
    recipeImage.innerHTML = '';
    recipeContent.innerHTML = '';
  }

  //looping over the fetch response and inserting the URL of your repos into a list
  for (var i = 0; i < data.length; i++) {
    recipeSearchResultContainer = document.createElement('div');
    recipeSearchResultImage = document.createElement('img');
    recipeSearchResultHeading = document.createElement('h3');
    recipeSearchResultButton = document.createElement('button');
    recipeSearchResultImage.setAttribute('src', data[i].recipe.image)
    recipeSearchResultHeading.textContent = data[i].recipe.label;
    recipeSearchResultButton.textContent = 'More Info';
    containerList.appendChild(recipeSearchResultContainer);
    cardImage[i].appendChild(recipeSearchResultImage);
    cardContent[i].appendChild(recipeSearchResultHeading);
    cardAction[i].appendChild(recipeSearchResultButton);
    recipeDisplay(data[i]);           
  }
}

//Display the recipe when the more info button is clicked on 
function recipeDisplay(data) {
  recipeSearchResultButton.addEventListener('click', function () {
    //shows the container by removing hidden class
    recipeContainer.classList.remove("hidden");
    //resets the image and content elements
    recipeImage.innerHTML = '';
    recipeContent.innerHTML = '';
    //Creates elements for the recipe display fucntion
    displayRecipeContainer = document.createElement('div');
    displayRecipeImage = document.createElement('img');
    displayRecipeHeading = document.createElement('h3');
    displayRecipeUnorderedList = document.createElement('ul');

    //Grab data for each element from the api
    displayRecipeImage.setAttribute('src', data.recipe.image);
    displayRecipeHeading.textContent = data.recipe.label;

    //For loop for ingredients
    for (var i = 0; i < data.recipe.ingredientLines.length; i++) {
      displayIngredients = document.createElement('li');
      displayIngredients.textContent = data.recipe.ingredientLines[i]
      displayRecipeUnorderedList.append(displayIngredients);
    }
    //Runs the youtube api function
    youtubeAPI(data);

    //appending elements
    recipeImage.append(displayRecipeImage);
    recipeContent.append(displayRecipeHeading);
    recipeContent.append(displayRecipeUnorderedList);
  })
}

//Function to display the youtube videos
function displayYoutubeVideos(data) {
  for (var i = 0; i < data.items.length; i++) {
    var youtubeId = data.items[i].id.videoId;
    displayRecipeVideo = document.createElement('iframe');
    displayRecipeVideo.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}`);
    recipeContent.append(displayRecipeVideo);
  }
}

//listens to a click that runs getApi function
fetchButton.addEventListener('click', getApi);

//Gets local storage items when page loads
listing();