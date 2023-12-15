class Ingredient {
  /**
   * @type{string}
   */
  id;
  /**
   * @type{string}
   */
  name;
  /**
   * @type{string}
   */
  description;
  /**
   * @type{string}
   */
  icon;
}

class Ingredients {
  /**
   * @type{Ingredient[]}
   */
  ads;
  /**
   * @type{Ingredient[]}
   */
  analytics;
  /**
   * @type{Ingredient[]}
   */
  auth;
  /**
   * @type{Ingredient[]}
   */
  blogs;
  /**
   * @type{Ingredient[]}
   */
  builders;
  /**
   * @type{Ingredient[]}
   */
  cdn;
  /**
   * @type{Ingredient[]}
   */
  cms;
  /**
   * @type{Ingredient[]}
   */
  compliance;
  /**
   * @type{Ingredient[]}
   */
  docs;
  /**
   * @type{Ingredient[]}
   */
  ecommerce;
  /**
   * @type{Ingredient[]}
   */
  fonts;
  /**
   * @type{Ingredient[]}
   */
  frameworks;
  /**
   * @type{Ingredient[]}
   */
  hosts;
  /**
   * @type{Ingredient[]}
   */
  libraries;
  /**
   * @type{Ingredient[]}
   */
  monitoring;
  /**
   * @type{Ingredient[]}
   */
  notifications;
  /**
   * @type{Ingredient[]}
   */
  other;
  /**
   * @type{Ingredient[]}
   */
  payments;
  /**
   * @type{Ingredient[]}
   */
  search;
  /**
   * @type{Ingredient[]}
   */
  security;
  /**
   * @type{Ingredient[]}
   */
  servers;
  /**
   * @type{Ingredient[]}
   */
  storage;
  /**
   * @type{Ingredient[]}
   */
  widgets;
  /**
   * @type{Ingredient[]}
   */
  wikis;
}

class PageData {
  /**
   * @type{string}
   */
  url;
  /**
   * @type{number}
   */
  matchingIngredientsCount;
  /**
   * @type{Ingredients}
   */
  ingredients;

  /**
   * @param {string} url
   * @param {number} matchingIngredientsCount
   * @param {Ingredients} ingredients
   */
  constructor(url, matchingIngredientsCount, ingredients) {
    this.url = url;
    this.matchingIngredientsCount = matchingIngredientsCount;
    this.ingredients = ingredients;
  }
}

const ingredientsApiUrl = "http://localhost:8000";

/**
 * @param {string} ingredientsApiUrl
 * returns{Promise<PageData>}
 */
async function getSauce(ingredientsApiUrl) {
  const currentTabUrl = await getCurrentTabUrl();
  document.getElementById("website-url").innerHTML = currentTabUrl;
  return await fetch(`${ingredientsApiUrl}/ingredients?url=${currentTabUrl}`)
    .then((res) => res.json())
    .then(
      (data) => new PageData(data.url, data.matching_ingredients, data.matches),
      console.error,
    );
}

/**
 *
 * @returns{Promise<string>}
 */
async function getCurrentTabUrl() {
  return browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      const url = tabs[0].url;
      const noHost = url.substring(url.indexOf(":") + 3);
      return noHost.substring(0, noHost.indexOf("/") ?? undefined);
    }, console.error);
}

/**
 * @param {string} groupName
 * @param {Ingredient[]} technologies
 * @returns{string}
 */
function renderIngredientGroup(groupName, technologies) {
  let outPreIngredients = `<div class="security-sauce column">
  <h3 class="sauce-category-title">${groupName}</h3>`;
  let ingredients = "";
  for (const technology of technologies) {
    ingredients += `<div class="security-sauce column">
  <div class="sauce-single row">
    <img
      class="sauce-icon"
      src="${ingredientsApiUrl}${technology.icon}"
      alt="{name}-icon"
    />
    <div class="sauce-info column">
      <div class="sauce-name">${technology.name}</div>
    </div>
  </div>
</div>`;
  }
  let outPostIngredients = `</div>`;

  return `${outPreIngredients}${ingredients}${outPostIngredients}`;
}

/**
 * @param {PageData} pageData
 */
function renderIngredientsContainer(pageData) {
  let outPre = `<div id="sauce">`;
  let categories = ``;
  const ingredientsKeys = Object.keys(pageData.ingredients);
  for (const key of ingredientsKeys) {
    if (!pageData.ingredients[key]) {
      continue;
    }
    categories += renderIngredientGroup(key, pageData.ingredients[key]);
  }
  let outPost = `</div>`;
  return `${outPre}${categories}${outPost}`;
}

function main() {
  const refreshButtonElement = document.getElementById("refresh-sauce-button");
  const sauceElement = document.getElementById("sauce");

  refreshButtonElement.addEventListener("click", () =>
    getSauce(ingredientsApiUrl),
  );

  window.addEventListener("load", async () => {
    const sauce = await getSauce(ingredientsApiUrl);
    sauceElement.innerHTML = renderIngredientsContainer(sauce); // renderIngredientGroup(
  });
}

main();
