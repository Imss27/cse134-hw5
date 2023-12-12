import { useState } from 'react';

const num_stars = 5;

const Rating = () => {
  const [starRating, setStarRating] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const submitRating = (rating) => {
    const formBody = new FormData();
    formBody.append('rating', rating);
    formBody.append('question', 'How satisfied are you?');
    formBody.append('sentBy', 'JS');

    fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'X-Sent-By': 'JavaScript' },
      body: formBody,
    })
    .then((res) => res.json())
    .then(console.log);

    setStarRating(rating);
    setIsFormSubmitted(true);
  };

  const getFeedbackMessage = () => {
    return starRating / num_stars >= 0.8
      ? `Thanks for the ${starRating} star rating!`
      : `Thanks for the feedback of ${starRating} stars. We'll try to do better!`;
  };

  return (
    <div className="rating-widget">
      {isFormSubmitted ? (
        <p>{getFeedbackMessage()}</p>
      ) : (
        Array.from({ length: num_stars }, (_, i) => (
          <button
            className="star-button"
            key={i}
            onClick={() => submitRating(i + 1)}
          >
          {'★'}
          </button>
        ))
      )}
    </div>
  );
};

export default Rating;
