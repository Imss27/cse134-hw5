function check(val, left, right) {
    let res = val;
    if(val < left) {
      res = left;
    }
    else if(val > right) {
      res = right;
    } 
    return res;
}

class ratingWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    

    connectedCallback() {
      const elem = document.querySelector('#rating');
      this.button = '★';
      this.stars = check(parseInt(elem.max, 10), 3, 10);
      this.text = 'How satisfied are you?';
      const style = `
        <style>
          div {
            width: auto;
          }
          button {
            color: grey;
            font-size: 3rem;
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
          }
          button:not(:last-child) {
            margin-right: 0.2rem;
          }
          div:hover button {
            color: yellow;
          }
          button:hover ~ button {
            color: grey;
          }
        </style>
      `;
  
      this.shadowRoot.innerHTML = style + '<div>' + this.createStars() + '</div>';
      this.attachEventListeners();
    }
  
    createStars() {
      let starsHtml = '';
      for (let i = 1; i <= this.stars; i++) {
        starsHtml += `<button data-star-value="${i}" aria-label="${i} Stars">${this.button}</button>`;
      }
      return starsHtml;
    }
  
    attachEventListeners() {
      this.shadowRoot.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', this.submitFormOnStarClick.bind(this));
      });
    }
  
    disconnectedCallback() {
      this.shadowRoot.querySelectorAll('button').forEach(button => {
        button.removeEventListener('click', this.submitFormOnStarClick.bind(this));
      });
    }
  
    submitFormOnStarClick(event) {
      const rating = event.target.dataset.starValue;
      const msg = rating / this.stars >= 0.8
        ? `Thanks for the ${rating} star rating!`
        : `Thanks for the feedback of ${rating} stars. We'll try to do better!`;
      
      this.shadowRoot.innerHTML = `<p>${msg}</p>`;
  
      const formBody = new FormData();
      formBody.append('rating', rating);
      formBody.append('question', this.text);
      formBody.append('sentBy', 'JS');
  
      fetch('https://httpbin.org/post', {
          method: 'POST',
          headers: { 'X-Sent-By': 'JavaScript' },
          body: formBody,
      }).then(res => res.json()).then(console.log);
    }
  
}
  
window.customElements.define('rating-widget', ratingWidget);
  