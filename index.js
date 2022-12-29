const pickColor = document.getElementById("pick-color");
const selectMode = document.getElementById("select-mode");
const getColorScheme = document.getElementById("get-scheme-btn");

function getRandomColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase()
  );
}
pickColor.value = getRandomColor();
let seedColor = pickColor.value.toUpperCase().slice(1);

pickColor.addEventListener("input", function () {
  seedColor = pickColor.value.toUpperCase().slice(1);
  return seedColor;
});

function renderSelectColorMode() {
  fetch(`https://www.thecolorapi.com/scheme?hex=${seedColor}`)
    .then((response) => response.json())
    .then((data) => {
      let schemeNamesHtml = "";
      for (let mode in data._links.schemes) {
        schemeNamesHtml += `<option value=${mode}>${mode}</option>`;
      }
      selectMode.innerHTML = schemeNamesHtml;
    });
}

function renderSchemes() {
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${selectMode.value}&count=5`
  )
    .then((response) => response.json())
    .then((data) => {
      const colorsArray = data.colors;
      let backgroundColorHtml = "";
      let colorsValueHtml = "";
      let colorMain = 0;
      let counterFooter = 0;
      colorsArray.map((color) => {
        backgroundColorHtml += `<div id='colorDiv${colorMain++}' class='color-div'
              style='background-color:${color.hex.value}'>
              </div>
            `;
        colorsValueHtml += `
        <div id='colorValue${counterFooter++}' class='colors-name'>${
          color.hex.value
        }</div>
        `;
      });
      document.getElementById("colors-container").innerHTML =
        backgroundColorHtml;
      document.getElementById("colors-name").innerHTML = colorsValueHtml;
    });
}
getColorScheme.addEventListener("click", renderSchemes);

function render() {
  renderSelectColorMode();
  renderSchemes();
}

render();

// copy to clipboard
let isClicked = false;
document.body.addEventListener("click", function (e) {
  if (!isClicked) {
    if (e.target.id.includes("colorValue")) {
      isClicked = true;
      let colorValueText = document.getElementById(e.target.id).innerText;
      handleCopyColor(colorValueText);
      message();
    } else if (e.target.id.includes("colorDiv")) {
      isClicked = true;
      let rgbValue = document.getElementById(e.target.id).style.backgroundColor;
      let rgbArray = rgbValue.match(/\d+/g);
      let hexValue = rgbToHex(rgbArray);
      handleCopyColor(hexValue);
      message();
    }
  }
});

//message copied to clipboard
function message() {
  let messageElement = document.createElement("div");
  messageElement.innerText = "copied to clipboard";
  messageElement.classList.add("message");
  document.body.appendChild(messageElement);
  setTimeout(() => {
    messageElement.parentNode.removeChild(messageElement);
    isClicked = false;
  }, 1500);
}
// take rgb color value from background-color from rendered colors, converting them to hex color
function rgbToHex(arr) {
  let hexValue = "";
  arr.map((item) => {
    hexValue += parseInt(item, 10).toString(16).padStart(2, "0").toUpperCase();
  });
  return "#" + hexValue;
}
// create input element, copy color value to clipboard
function handleCopyColor(colorValue) {
  const footerElement = document.getElementById("colors-name");
  let inputElement = document.createElement("input");
  inputElement.setAttribute("value", colorValue);
  footerElement.appendChild(inputElement);
  inputElement.select();
  navigator.clipboard.writeText(inputElement.value);
  inputElement.parentNode.removeChild(inputElement);
}
