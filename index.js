"use strict";
const storesNav = document.querySelector(".stores-Side-Nav");
const gameCards = document.querySelector(".gameCards");

//--------------
const getGames = async function () {
  const fetchStores = await fetch("https://www.cheapshark.com/api/1.0/stores");
  const storeData = await fetchStores.json();
  console.log(storeData);
  storeData.map((element) => {
    const { storeID, storeName, isActive, images } = element;
    const listItem = document.createElement("li");

    listItem.dataset.id = `${storeID}`;
    const storeLogo = document.createElement("img");
    const { logo, banners, icon } = images;
    listItem.data = `${storeID}`;
    listItem.classList.add("card");

    if (isActive === 1) {
      storeLogo.src = `https://www.cheapshark.com${logo}`;
      listItem.appendChild(storeLogo);
      storesNav.appendChild(listItem);
    }
  });

  /////-------------
  const gameStores = document.querySelectorAll("[data-id]");

  gameStores.forEach((ele) => {
    ele.addEventListener("click", () => {
      fetchGames(ele.dataset.id);
    });
  });
};
getGames();

////--------

const fetchGames = async (id) => {
  const fetchGameData = await fetch(
    `https://www.cheapshark.com/api/1.0/deals?storeID=${id}`
  );

  const gameData = await fetchGameData.json();
  console.log(gameData);
  removeAllChildNodes(gameCards);
  gameData.map((ele) => {
    const { title, dealID, normalPrice, releaseDate, salePrice, savings } = ele;

    // if (gameCards.childNodes === true) {
    //   gameCards.removeChild(gameCard);
    // }

    const gameCard = document.createElement("div");
    const gameTitle = document.createElement("h4");

    gameCard.dataset.id = `${dealID}`;
    gameTitle.innerText = title;

    gameCard.appendChild(gameTitle);
    gameCards.appendChild(gameCard);
  });
};
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
