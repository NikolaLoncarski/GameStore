let cartData = JSON.parse(localStorage.getItem("gamesInCart"));
console.log(cartData);
const gameCards = document.querySelector(".gameCards");

const totalPrice = document.querySelector(".totalPrice");
const totalSaved = document.querySelector(".totalSaved");
let total = [];
let totalSavings = [];

const displayCartGames = cartData.map((element) => {
  const {
    title,
    dealID,
    normalPrice,
    releaseDate,
    salePrice,
    savings,
    thumb,
    metacriticLink,
    name,
  } = element;
  let discount;
  if (savings) {
    discount = parseFloat(savings).toFixed(1);
  } else {
    discount = "0";
  }
  //// total price for all items and money saved
  total.push(+salePrice);

  ////--------///////
  const unixTime = releaseDate * 1000;
  const date = new Date(unixTime);
  if (savings > 0) {
    const moneyNotSpent = ((+salePrice / +savings) * 100).toFixed(2);
    totalSavings.push(+moneyNotSpent);
    console.log(totalSavings);
  }
  ////overall card div
  const gameCard = document.createElement("div");
  gameCard.classList.add("wish");
  gameCard.dataset.id = `${dealID}`;

  const gameTitle = document.createElement("h4");
  gameTitle.classList.add("gameTitle");
  gameTitle.innerText = `${title || name}`;

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("imageContainer");

  const gameThumb = document.createElement("img");
  gameThumb.src = `${thumb}`;

  imageContainer.append(gameThumb);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerText = "remove";
  //--------------Prices ------------//
  const gamePrices = document.createElement("div");
  gamePrices.classList.add("gamePrices");
  const normPrice = document.createElement("span");

  normPrice.innerText = `Normal Price:${normalPrice || salePrice}$`;

  const price = document.createElement("span");

  price.innerText = `Current Price:${salePrice}$`;

  const moneySaved = document.createElement("span");
  moneySaved.classList.add("moneySaved");
  moneySaved.innerText = `Money Saved:${+discount}%`;

  gamePrices.appendChild(normPrice);
  gamePrices.appendChild(moneySaved);
  gamePrices.appendChild(price);

  ///---------------//-----------------------//
  const gameReleaseDate = document.createElement("span");
  gameReleaseDate.classList.add("gameDate");

  if (date > 0) {
    gameReleaseDate.innerText = `Release Date:${date.toLocaleDateString(
      "en-US"
    )}`;
  } else {
    gameReleaseDate.innerText = "Release Date:N/A";
  }

  gameCard.append(deleteButton);
  gameCard.append(imageContainer);
  gameCard.append(gameTitle);
  gameCard.append(gamePrices);
  gameCard.append(gameReleaseDate);
  gameCards.append(gameCard);
  const gameInfoLink = document.createElement("a");
  const metacriticIcon = document.createElement("img");
  gameInfoLink.classList.add("metacritic");
  metacriticIcon.src = "./metacritic.png";
  metacriticIcon.alt = "Metacritic icon";

  gameInfoLink.href = `https://www.metacritic.com${metacriticLink}`;
  if (metacriticLink) {
    gameInfoLink.target = "_blank";
  } else {
    gameInfoLink.style.pointerEvents = "none";
  }

  ///Check if there is a realse date information

  gameInfoLink.appendChild(metacriticIcon);
  gameCard.append(gameInfoLink);
  ////------deletes the element-------//////
  deleteButton.addEventListener("click", () => {
    total.pop();
    totalSavings.pop();
    addSum();
    const index = cartData.findIndex((game) => game.dealID === dealID);

    if (index > -1) {
      cartData.splice(index, 1);
      localStorage.gamesInCart = JSON.stringify(cartData);
      deleteButton.parentNode.remove();
    }
  });
});

const addSum = () => {
  if (displayCartGames) {
    const addUptotal = total.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    const addUpSavings = totalSavings.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    totalPrice.textContent = `${addUptotal.toFixed(2)}`;
    totalSaved.textContent = `${addUpSavings.toFixed(2)}`;
  }
};
addSum();
