import React, {useCallback, useEffect, useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({isError: false, message: ''});

    const fetchMovieHandler = useCallback(async ()=>{
        setIsLoading(true);
        setError({isError: false, message: ''});
        try {
            const response = await fetch('https://swapi.dev/api/films');
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const data = await response.json();
            const transformedMovies = data.results.map((movieData) => {
                return {
                    id: movieData.episode_id,
                    title: movieData.title,
                    openingText: movieData.opening_crawl,
                    releaseDate: movieData.release_date
                }
            });
            setMovies(transformedMovies);
        } catch (e) {
            console.log(e);
            setError({isError: true, message: "통신 오류가 발생하였습니다."});
        }
        setIsLoading(false);

    },[]);
    useEffect(()=>{
        fetchMovieHandler();
    },[fetchMovieHandler]);
    let contents = <p>Found no movies.</p>;

    if (movies.length > 0) {
        contents = <MoviesList movies={movies}/>
    }
    if (error.isError) {
        contents = <p>{error.message}</p>;
    }
    if (isLoading) {
        contents = <p>Loading...</p>;
    }

    return (
        <React.Fragment>
            <section>
                <button onClick={fetchMovieHandler}>Fetch Movies</button>
            </section>
            <section>{contents}</section>
        </React.Fragment>
    );
}

export default App;
