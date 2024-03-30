import React, { useState, useEffect } from "react";
import './JokeList.css';
import axios from "axios";
import Joke from './Joke';

const JokeList = ({ numJokes = 5 }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [jokes, setJokes] = useState([]);
  const [hasError, setHasError] = useState(false);

  async function requestJoke() {
    const response = await axios.get("https://icanhazdadjoke.com", {
      headers: { Accept: "application/json" }
    });
    let { ...joke } = response.data;
    return joke;
  }

  async function generateNewJokes() {
    setJokes(() => jokes.filter(i => i.isLocked));
    localStorage.clear();
    setIsLoading(true);
    let seenJokes = new Set();
    try {
      while (jokes.length < numJokes) {
        let newJoke = await requestJoke();
        if (!seenJokes.has(newJoke.id)) {
          seenJokes.add(newJoke.id);
          setJokes(() => {
            jokes.push({ ...newJoke, votes: 0, isLocked: false });
            return jokes;
          });
          localStorage.setItem("jokes", JSON.stringify(jokes))
        } else {
          console.log("duplicate joke received")
        }
      }
      setIsLoading(false);
    } catch (err) {
      setHasError(true);
      console.log("Error loading page.")
    }
  }

  useEffect(() => {
    const storedJokes = localStorage.getItem("jokes");
    if (storedJokes) {
      return setJokes(() => {
        setIsLoading(false)
        return JSON.parse(storedJokes)
      })
    } else {
      generateNewJokes();
    }
  }, [])

  const vote = ({ jokeId, voteType }) => {
    let delta;
    voteType === 'up' ? delta = +1 : delta = -1;
    setJokes(jokes => jokes.map(i => {
      return i.id !== jokeId ? { ...i } : { ...i, votes: i.votes + delta }
    }));
  }

  const reset = (jokeId) => {
    setJokes(jokes => jokes.map(i => {
      return i.id !== jokeId ? { ...i } : { ...i, votes: 0 }
    }));
  };

  const lock = (jokeId) => {
    const updatedJokes = jokes.map(i => {
      if(i.id === jokeId){
        i.isLocked === false ? i.isLocked = true : i.isLocked = false;
        return {...i}
      } else {
        return {...i};
      }
    })
    setJokes(updatedJokes)
  }

  useEffect(() => {
    localStorage.setItem("jokes", JSON.stringify(jokes))
  }, [jokes])

  const sortedJokes = jokes.sort((a, b) => b.votes - a.votes);

  function renderJokesOrSpinner() {
    if (isLoading === true) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    } else if (isLoading === false) {

      return sortedJokes.map(i => {
        return (
          <Joke id={i.id}
            key={i.id}
            text={i.joke}
            votes={i.votes}
            isLocked={i.isLocked}
            vote={vote}
            reset={reset}
            lock={lock}
          />
        )
      })
    } else {
      return (
        <div className='error-msg'>
          <h3>Error loading page.</h3>
        </div>
      )
    }
  }

  const render = renderJokesOrSpinner();

  return (
    <div className="JokeList">
      <button className='JokeList-getmore'
        onClick={generateNewJokes}>
        Get New jokes
      </button>
      <h1>Have Some Dad Jokes!</h1>
      <ul>
        {render}
      </ul>
    </div>
  )

}

export default JokeList;