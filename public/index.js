const shimmer = document.querySelector(".shimmer");

async function getCountryData() {
  const data = await fetch("/api/v1/countries/");
  const json = await data.json();

  const dropDownContainer = document.getElementById("dropdown-container");
  const selectEl = document.createElement("select");
  selectEl.classList.add("dropdown");

  let optionalStr = json.data.map((val) => {
    const optionEl = document.createElement("option");
    const valId = document.createAttribute("value");
    valId.value = val.id;
    optionEl.innerText = val.name;
    optionEl.setAttributeNode(valId);
    return optionEl;
  });

  optionalStr.forEach((el) => {
    selectEl.append(el);
  });

  dropDownContainer.append(selectEl);

  const dropDown = document.querySelector(".dropdown");
  let id = dropDown.value;

  async function getDropdownValue(id) {
    const countryData = await fetch("api/v1/countries/" + id);
    let countryJson = await countryData.json();

    const displayData = document.querySelector("#display-container");

    displayData.insertAdjacentHTML(
      "afterbegin",
      `<div id=${id} class="country-div"><h1 >${countryJson?.data?.name}</h1> <img src=${countryJson?.data?.flag} alt="malay img" class="img"/><p class="rank">${countryJson?.data?.rank}</p></div>`
    );
  }

  getDropdownValue(id);

  dropDown.addEventListener("change", (e) => {
    id = dropDown.value;
    getDropdownValue(id);
    const el = document.querySelectorAll(".country-div");

    el.forEach((val) => (val.style.display = "none"));
  });
}

getCountryData();

const inputForm = document.querySelector(".input-form");

inputForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // const countryName = document.querySelector("#country-name").value;
  // const countryFlag = document.querySelector("#country-flag").files[0];
  // const countryRank = document.querySelector("#country-rank").value;
  // console.log(countryName, countryFlag["0"], countryRank);
  // console.log(document.querySelector("#continent").value);

  let form = new FormData();
  form.append("name", document.querySelector("#country-name").value);
  form.append("photo", document.querySelector("#country-flag").files[0]);
  form.append("rank", document.querySelector("#country-rank").value);
  form.append("continent", document.querySelector("#continent").value);

  console.log("form", form);

  await fetch("/api/v1/countries/", {
    method: "POST",
    body: form,
  });

  getCountryData();
  document.querySelector("#dropdown-container").innerHTML = "";
  document.querySelector("#display-container").innerHTML = "";
});
