import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import session
# Load and preprocess dataset
df = pd.read_csv('imdb_top_1000.csv')
df.dropna(subset=['Overview', 'Poster_Link'], inplace=True)
df['combined_features'] = df['Genre'] + ' ' + df['Director'] + ' ' + df['Star1'] + ' ' + df['Overview']

# TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['combined_features'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

indices = pd.Series(df.index, index=df['Series_Title'].str.lower())

def get_all_movies():
    return df[['Series_Title', 'Genre', 'IMDB_Rating', 'Poster_Link' , 'Released_Year' , 'Overview']].to_dict(orient='records')

def search_movies(query):
    query = query.lower()
    results = df[df['Series_Title'].str.lower().str.contains(query)]
    return results[['Series_Title', 'Genre', 'IMDB_Rating', 'Poster_Link' , 'Released_Year']].to_dict(orient='records')

def filter_by_genre(genre):
    genre = genre.lower()
    results = df[df['Genre'].str.lower().str.contains(genre)]
    return results[['Series_Title', 'Genre', 'IMDB_Rating', 'Poster_Link' , 'Released_Year']].to_dict(orient='records')

def add_to_watchlist(watchlist, title):
    if title not in watchlist:
        watchlist.append(title)
def remove_from_watchlist(watchlist, title):
    if title in watchlist:
        watchlist.remove(title)
    return watchlist

def get_recommendations(watchlist):
    watchlist_indices = [indices.get(title.lower()) for title in watchlist if indices.get(title.lower()) is not None]
    if not watchlist_indices:
        return []
    
    # Average cosine similarity scores for the watchlist
    sim_scores = cosine_sim[watchlist_indices].mean(axis=0)
    sim_indices = sim_scores.argsort()[-10:][::-1]
    recommendations = df.iloc[sim_indices][['Series_Title', 'Genre', 'IMDB_Rating', 'Poster_Link' , 'Released_Year']].to_dict(orient='records')
    return recommendations
