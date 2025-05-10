from flask import Flask, render_template, request, jsonify, session
from recommender import get_all_movies, search_movies, filter_by_genre, add_to_watchlist, remove_from_watchlist, get_recommendations

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Set a secret key for session handling

# Route to render the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route to get movies based on query or genre
@app.route('/get_movies')
def get_movies():
    query = request.args.get('q', '').strip()
    genre = request.args.get('genre', '').strip()
    
    if query:
        # Search movies based on title
        movies = search_movies(query)
    elif genre:
        # Filter movies based on genre
        movies = filter_by_genre(genre)
    else:
        # Return all movies if no filter is provided
        movies = get_all_movies()

    return jsonify(movies)

# Route for movie search autocomplete
@app.route('/autocomplete')
def autocomplete():
    query = request.args.get('q', '').lower()
    all_movies = get_all_movies()
    
    # Suggest movies based on query matching Series_Title
    suggestions = [movie for movie in all_movies if query in movie['Series_Title'].lower()]
    
    return jsonify(suggestions)

# Route to add a movie to the watchlist
@app.route('/add_to_watchlist', methods=['POST'])
def add_movie_to_watchlist():
    movie = request.json.get('movie')
    
    if 'watchlist' not in session:
        session['watchlist'] = []  # Initialize watchlist if it doesn't exist
    
    if movie not in session['watchlist']:
        add_to_watchlist(session['watchlist'], movie)  # Add movie using helper function
        session.modified = True  # Ensure session is updated
    
    return jsonify({'message': 'Movie added to watchlist'})

# Route to remove a movie from the watchlist
@app.route('/remove_from_watchlist', methods=['POST'])
def remove_movie_from_watchlist():
    movie = request.json.get('movie')
    
    if 'watchlist' in session and movie in session['watchlist']:
        remove_from_watchlist(session['watchlist'], movie)  # Remove movie using helper function
        session.modified = True  # Ensure session is updated
        return jsonify({'message': 'Movie removed from watchlist'})
    
    return jsonify({'message': 'Movie not found in watchlist'}), 404

# Route to get the current watchlist
@app.route('/get_watchlist')
def get_watchlist():
    from recommender import get_all_movies  # Make sure this is imported
    all_movies = get_all_movies()
    watchlist_titles = session.get('watchlist', [])
    # Return full movie dicts that match watchlist titles
    watchlist_movies = [movie for movie in all_movies if movie['Series_Title'] in watchlist_titles]
    return jsonify(watchlist_movies)
 # Return the watchlist (empty list if not present)

# Route to get personalized recommendations based on the watchlist
@app.route('/get_recommendations')
def recommendations():
    if 'watchlist' not in session or not session['watchlist']:
        return jsonify([])  # Return empty list if watchlist is empty
    
    watchlist = session['watchlist']
    recommendations = get_recommendations(watchlist)  # Get recommendations using helper function
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(debug=True)
