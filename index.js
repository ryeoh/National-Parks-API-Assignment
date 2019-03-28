'use strict';

// The user must be able to search for parks in one or more states.
// The user must be able to set the max number of results, with a default of 10.
// The search must trigger a call to NPS's API.
// The parks in the given state must be displayed on the page. Include at least:
// Full name
// Description
// Website URL
// The user must be able to make multiple searches and see only the results for the current search.

const apiKey = 'JgPKgAB5EWEAhUQIldOr3JGS245XO6xkU9A7YVb2';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

// format query parameters
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

// watch the form for inputs
function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchState = $('#js-search-state').val();
        const maxResults = $('#js-max-results').val();
        getNPSdata(searchState, maxResults);
    });
}

// call the NPS API
function getNPSdata(searchState, maxResults) {
    let params = {
        stateCode: searchState,
        limit: maxResults - 1,
        'api_key': apiKey
    };
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

// display the results in the DOM
function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    // iterate through the items array
    for (let i = 0; i < responseJson.data.length; i++){
        $('#results-list').append(
        `<li><a href='${responseJson.data[i].url}'><h3>${responseJson.data[i].fullname}</h3></a>
        <p>${responseJson.data[i].description}</p>
        </li>`
    )};
  //display the results section  
  $('#results').removeClass('hidden');
}

$(watchForm);
