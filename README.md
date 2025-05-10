# 🎬 Movie Recommendation System

A single-page web application that recommends movies based on your watchlist using collaborative filtering and displays data from the IMDb Top 1000 Movies dataset. Built using Flask, JavaScript, HTML/CSS, and scikit-learn.

## 🔧 Features

* **🔍 Search Bar with Autocomplete:** Search for movies by title with smart autocomplete suggestions.
* **🎭 Genre-Based Browsing:** Filter movies by a single genre using clickable buttons.
* **🎞️ Movie Cards Display:** View movies with their poster, title, rating, and genre.
* **❤️ Watchlist Feature:** Add and remove movies from your watchlist (stored in session).
* **🤝 Personalized Recommendations:** Get recommendations based on your watchlist using content-based collaborative filtering.

## 🗂️ Dataset Used

The project uses a cleaned version of the [IMDb Top 1000 Movies Dataset](https://www.kaggle.com/harshitshankd/imdb-top-1000-movies).

**Main columns:**

`Series_Title`, `Released_Year`, `Certificate`, `Runtime`, `Genre`, `IMDB_Rating`, `Overview`, `Meta_score`, `Director`, `Star1`, `Star2`, `Star3`, `Star4`, `No_of_votes`, `Gross`, `Poster_Link`.

## 📁 Folder Structure
```bash
project/
├── app.py             # Flask backend application
├── recommender.py     # Recommendation logic
├── imdb_top_1000.csv  # Dataset
│
├── static/
│   └── styles.css  # Styling for the web app
│   └── script.js   # Frontend interactivity
│
└── templates/
└── index.html      # Main HTML page
```
## 🚀 How to Run

1.  **Install Dependencies**

    Make sure you have Python installed. Then install the required packages:

    ```bash
    pip install flask scikit-learn pandas
    ```

2.  **Run the App**

    ```bash
    python app.py
    ```

    Then open your browser and go to [http://127.0.0.1:5000](http://127.0.0.1:5000).

## 🤖 Recommendation Logic

A TF-IDF vector is computed from a combination of **Genre**, **Director**, **Stars**, and **Overview**.

Cosine Similarity is used to recommend movies similar to those in your watchlist.

Movies already in the watchlist are not re-recommended.

## 📌 To Do (Optional Enhancements)

* Add user authentication
* Save watchlists to a database
* Implement pagination and loading indicators
* Develop a rating or review system

## 🧑‍💻 Author

Zakir (Feel free to modify this with your actual name or GitHub link)

## 📜 License

This project is open source and free to use for educational purposes.
