// https://www.thecolorapi.com

fetch("https://www.thecolorapi.com/scheme/mode")
  .then((response) => response.json())
  .then((data) => console.log(data));

const colorValue = document.getElementById("color");
console.log(colorValue);

colorValue.addEventListener("input", function () {
  console.log(colorValue.value);
  let color = colorValue.value;
  document.getElementById("hex-color").textContent = color;
});
