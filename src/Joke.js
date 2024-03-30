import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Joke.css';


const Joke = ({ id, votes, text, isLocked, vote, reset, lock }) => {
  let voteObj = {
    jokeId: id,
    voteType: ''
  };
  return (
    <div className={isLocked !== false ? "Joke Joke-locked" : "Joke"}>
      <div className="Joke-votearea">

        <button onClick={() => {
          voteObj.voteType = 'up';
          return vote(voteObj)
        }}>
          <i className="fas fa-thumbs-up" /> </button>

        <button onClick={() => {
          voteObj.voteType = 'down';
          return vote(voteObj)
        }}>
          <i className="fas fa-thumbs-down" /> </button>

        <p>{votes}</p>
        <button onClick={() => reset(id)}>Reset</button>

      </div>
      <div className="Joke-text">{text}</div>
      <div className="Joke-lock">
        <button onClick={()=>lock(id)}>
          <i className={isLocked !== true ? "fas fa-lock-open" : "fas fa-lock"} />
        </button>
      </div>
    </div>
  )
}

export default Joke;