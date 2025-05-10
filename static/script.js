let watchlist = [];
let searchTimeout;

// Fetch and update the watchlist
function fetchWatchlist() {
    fetch('/get_watchlist')
        .then(response => response.json())
        .then(data => {
            watchlist = data;
            displayWatchlist();
        })
        .catch(error => {
            console.error('Error fetching watchlist:', error);
            alert('Error fetching watchlist. Please try again later.');
        });
}

// Display movies in the main container
function displayMovieCards(movies) {
    const container = document.getElementById('movie-container');
    container.innerHTML = ''; // Clear existing movie cards

    if (movies && movies.length > 0) {
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'movie-card';

            const img = document.createElement('img');
            img.src = movie.Poster_Link || 'default-poster.jpg'; // Handle missing poster link
            card.appendChild(img);

            const title = document.createElement('h4');
            title.textContent = movie.Series_Title || 'No Title'; // Handle missing title
            card.appendChild(title);

            const rating = document.createElement('p');
            rating.textContent = `Rating: ${movie.IMDB_Rating || 'N/A'} | Year: ${movie.Released_Year || 'N/A'}`;
            card.appendChild(rating);

            const button = document.createElement('button');
            if (watchlist.includes(movie.Series_Title)) {
                button.textContent = 'Remove from Watchlist';
                button.onclick = () => removeFromWatchlist(movie.Series_Title, movies);
            } else {
                button.textContent = 'Add to Watchlist';
                button.onclick = () => addToWatchlist(movie.Series_Title, movies);
            }
            card.appendChild(button);

            container.appendChild(card);
        });
    } else {
        const noMoviesMessage = document.createElement('p');
        noMoviesMessage.textContent = 'No movies found.';
        container.appendChild(noMoviesMessage);
    }
}

// Display the watchlist section
function displayWatchlist() {
    const container = document.getElementById('watchlist');
    container.innerHTML = ''; // Clear existing watchlist items
    
    if (watchlist.length > 0) {
        watchlist.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'watchlist-movie';

            const img = document.createElement('img');
            img.src = movie.Poster_Link || 'default-poster.jpg';
            card.appendChild(img);

            const data = document.createElement('div');

            const title = document.createElement('h4');
            title.textContent = movie.Series_Title || 'No Title';
            card.appendChild(title);

            const rating = document.createElement('p');
            rating.textContent = `Rating: ${movie.IMDB_Rating || 'N/A'}`;
            const year = document.createElement('p');
            year.textContent = `Year: ${movie.Released_Year || 'N/A'}`;
            data.appendChild(rating);
            data.appendChild(year);
            const overview = document.createElement('p');
            overview.textContent =  `Story Line :  ${movie.Overview} `|| '';
            data.appendChild(overview);

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => removeFromWatchlist(movie.Series_Title, []);
            card.appendChild(data);
            card.appendChild(removeBtn);
            
            container.appendChild(card);
        });
    } else {
        const noWatchlistMessage = document.createElement('p');
        noWatchlistMessage.textContent = 'Your watchlist is empty.';
        container.appendChild(noWatchlistMessage);
    }
}


// Add a movie to the watchlist
function addToWatchlist(title, movies) {
    fetch('/add_to_watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: title })
    })
    .then(response => response.json())
    .then(() => {
        alert(`${title} added to watchlist`);
        // Update the watchlist immediately without fetching again
        watchlist.push(title);
        fetchWatchlist();
        displayMovieCards(movies);
        displayWatchlist();
    })
    .catch(error => {
        console.error('Error adding movie to watchlist:', error);
        alert('Error adding movie to watchlist. Please try again later.');
    });
}

function toggleWatchlist(button) {
    document.querySelectorAll('.feature-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.genre-button').forEach(btn => btn.classList.remove('active'));

    const watchlistDiv = document.getElementById('watchlist');
    const display = watchlistDiv.style.display;
    const otherDisplay = document.getElementById('movie-container');
    otherDisplay.style.display = 'none';
    watchlistDiv.style.display = 'block';
    displayWatchlist();
}

// Remove a movie from the watchlist
function removeFromWatchlist(title, movies) {
    fetch('/remove_from_watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie: title })
    })
    .then(response => response.json())
    .then(() => {
        alert(`${title} removed from watchlist`);
        // Remove from the watchlist array immediately
        watchlist = watchlist.filter(movie => movie !== title);
        displayMovieCards(movies);
        fetchWatchlist();
        displayWatchlist();
    })
    .catch(error => {
        console.error('Error removing movie from watchlist:', error);
        alert('Error removing movie from watchlist. Please try again later.');
    });
}

// Filter movies by genre
function filterByGenre(genre, button) {
    document.querySelectorAll('.genre-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.feature-button').forEach(btn => btn.classList.remove('active'));
    const otherDisplay = document.getElementById('watchlist');
    otherDisplay.style.display = 'none';
    const displayContent = document.getElementById('movie-container');
    displayContent.style.display = 'grid';
    fetch(`/get_movies?genre=${encodeURIComponent(genre)}`)
        .then(response => response.json())
        .then(movies => {
            displayMovieCards(movies);
        })
        .catch(error => {
            console.error('Error filtering by genre:', error);
            alert('Error fetching movies by genre. Please try again later.');
        });
}

// Search movies with debouncing
function searchMovies() {
    const query = document.getElementById('search-bar').value.trim();
    const status = document.getElementById('searchingAnime');
    status.textContent = 'Searching...';
    const displayContent = document.getElementById('movie-container');
    displayContent.style.display = 'grid';
        document.querySelectorAll('.feature-button').forEach(btn => btn.classList.remove('active'));


    const otherDisplay = document.getElementById('watchlist');
    otherDisplay.style.display = 'none';

    clearTimeout(searchTimeout); // Clear the previous timeout to debounce the search
    searchTimeout = setTimeout(() => {
        fetch(`/get_movies?q=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(movies => {
                displayMovieCards(movies);
                status.textContent = ''; // Clear searching status
            })
            .catch(error => {
                console.error('Error searching for movies:', error);
                status.textContent = 'Error occurred.';
                alert('Error searching for movies. Please try again later.');
            });
    }, 1000);  // Wait 1 second after user stops typing to make the request
}

// Get personalized recommendations based on the watchlist
function getRecommendations(button) {
    document.querySelectorAll('.feature-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.genre-button').forEach(btn => btn.classList.remove('active'));

    const displayContent = document.getElementById('movie-container');
    displayContent.style.display = 'grid';

    const otherDisplay = document.getElementById('watchlist');
    otherDisplay.style.display = 'none';


    if (watchlist.length === 0) {
        alert('Your watchlist is empty. Add some movies to get recommendations.');
        return;
    }

    fetch('/get_recommendations')
        .then(response => response.json())
        .then(movies => {
            displayMovieCards(movies);
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
            alert('Error fetching recommendations. Please try again later.');
        });
}

// On page load, fetch and display the watchlist
window.onload = () => {
    fetch('/get_movies')
    .then(response => response.json())
    .then(movies => {
        displayMovieCards(movies);
    })
    .catch(error =>{
        console.log("Error while fetching data : " , error);
        alert('no data found!!');
    })
};
