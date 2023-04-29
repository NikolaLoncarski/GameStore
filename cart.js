let cartData = JSON.parse(localStorage.getItem("gamesInCart"));
console.log(cartData);
const gameCards = document.querySelector(".gameCards");

const ids = cartData.map((o) => o.dealID);
const filtered = cartData.filter(
  ({ dealID }, index) => !ids.includes(dealID, index + 1)
);
console.log(filtered);

const displayCartGames = filtered.map((element) => {
  const {
    title,
    dealID,
    normalPrice,
    releaseDate,
    salePrice,
    savings,
    thumb,
    metacriticLink,
  } = element;
  const unixTime = releaseDate * 1000;
  const date = new Date(unixTime);

  ////overall card div
  const gameCard = document.createElement("div");
  gameCard.classList.add("game");
  gameCard.dataset.id = `${dealID}`;

  const gameTitle = document.createElement("h4");
  gameTitle.classList.add("gameTitle");
  gameTitle.innerText = title;

  const gameThumb = document.createElement("img");
  gameThumb.src = `${thumb}`;

  //--------------Prices ------------//
  const gamePrices = document.createElement("div");
  gamePrices.classList.add("gamePrices");

  const normPrice = document.createElement("span");
  normPrice.classList.add("normPrice");
  normPrice.innerText = `Normal Price:${normalPrice}$`;

  const price = document.createElement("span");
  price.classList.add("price");
  price.innerText = `Current Price:${salePrice}$`;

  const moneySaved = document.createElement("span");
  moneySaved.classList.add("moneySaved");
  moneySaved.innerText = `Money Saved:${parseFloat(savings).toFixed(1)}%`;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteButton");
  deleteButton.innerText = "remove";

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

  gameCard.appendChild(gameTitle);
  gameCard.prepend(gameThumb);
  gameCard.append(gamePrices);
  gameCard.append(gameReleaseDate);
  gameCard.append(deleteButton);
  gameCards.appendChild(gameCard);
  ///Check if there is a realse date information
  const gameInfoLink = document.createElement("a");
  gameInfoLink.href = `https://www.metacritic.com${metacriticLink}`;
  if (metacriticLink) {
    gameInfoLink.target = "_blank";
    gameInfoLink.text = "More Information";
  } else {
    gameInfoLink.text = "More Information not available";
  }

  deleteButton.addEventListener("click", () => {
    const index = cartData.findIndex((game) => game.dealID === dealID);

    if (index > -1) {
      cartData.splice(index, 1);
      localStorage.gamesInCart = JSON.stringify(cartData);
      deleteButton.parentNode.remove();
    }
  });
});
