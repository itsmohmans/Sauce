const el = document.getElementById("myHeading");
const buttonElement = document.getElementById("get-sauce-button");

const ingredientsApiUrl = "http://localhost:8000";

async function getSauce() {
  el.innerHTML = await getCurrentTabUrl();
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

el.addEventListener("click", getSauce);
buttonElement.addEventListener("click", getSauce);
