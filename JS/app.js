const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let activeNotice = document.createElement("div");

let mainSection = document.querySelector(".main-section");

if (urlParams.get("code")) {
  generateToken();
}

async function generateToken() {
  const code = urlParams.get("code");
  const url = "https://login.eveonline.com/v2/oauth/token";
  const auth =
    "N2I4MjkyYjRjYjNlNGJkN2JjMzUwZmI0ZDFhZWRhMjQ6c2l5Z21vakx2bFJjYkgxN1YzQTFiRk5uMmFUdlNiQ3BmRzlLZk5iNQ==";
  const data = await authApi(url, code, auth);
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;

  if (accessToken) {
    let jobsData = await fetchJobs(accessToken);

    let installerList = await sortJobs(jobsData);
    let corpData = await fetchCorpMembers(accessToken);

    let inactive = sortActive(corpData, installerList);

    printInactive(inactive);
  }
}

async function authApi(url, code, auth) {
  const dataFetch = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
      Host: "login.eveonline.com",
    },
    body: `grant_type=authorization_code&code=${code}`,
  });
  const data = await dataFetch.json();

  return data;
}

async function fetchJobs(accessToken) {
  const dataFetch = await fetch(
    "https://esi.evetech.net/latest/corporations/98239242/industry/jobs/?datasource=tranquility&include_completed=false&page=1",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await dataFetch.json();
  return data;
}

function sortJobs(jobsData) {
  let length = jobsData.length;
  let installerList;
  let i = 0;
  for (i = 0; i < length; i++) {
    let currentDate = new Date();
    let jobEnd = new Date(jobsData[i].end_date);

    if (currentDate < jobEnd) {
      installerList = addInstaller(jobsData[i].installer_id, installerList);
      console.log(currentDate);
      console.log(jobEnd);
      console.log("Active");
    }
  }
  return installerList;
}

async function fetchChar(installer) {
  const url = `https://esi.evetech.net/latest/characters/${installer}/?datasource=tranquility`;

  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
  const data = await dataFetch.json();

  return data.name;
}

async function fetchCorpMembers(accessToken) {
  const url =
    "https://esi.evetech.net/latest/corporations/98239242/members/?datasource=tranquility";
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await dataFetch.json();
  return sortCorp(data);
}

async function sortCorp(corpData) {
  let length = corpData.length;
  let corpMembers = [];
  let i = 0;
  for (i = 0; i < length; i++) {
    corpMembers.push(corpData[i]);
  }

  return corpMembers;
}

function addInstaller(installerID, installerList) {
  let i = 0;
  let length;
  let orginalList;

  if (Array.isArray(installerList)) {
    length = installerList.length;
    orginalList = installerList;
  } else {
    installerList = [];
    installerList.push(installerID);
    return installerList;
  }

  for (i = 0; i < length; i++) {
    if (installerList[i] == installerID) {
      return orginalList;
    } else if (i == length - 1) {
      installerList.push(installerID);

      return installerList;
    }
  }
}

function sortActive(corpData, installerList) {
  if (!Array.isArray(installerList)) {
    return corpData;
  }

  let inactiveList = corpData;
  let installerLength = installerList.length;
  let i = 0;
  let j = 0;

  do {
    if (inactiveList[i] == installerList[j]) {
      inactiveList.splice(i, 1);
      j++;
      i = 0;
    } else {
      i++;
    }
  } while (j < installerLength);

  return inactiveList;
}

// Displays the list of inactive characters

async function printInactive(inactive) {
  let inactiveList = document.createElement("ul");
  let inactiveTitle = document.createElement("h2");
  inactiveTitle.innerHTML = "Inactive";
  mainSection.appendChild(inactiveTitle);
  mainSection.appendChild(inactiveList);
  let length = inactive.length;
  let i;

  for (i = 0; i < length; i++) {
    let currentLi = document.createElement("li");
    currentLi.innerHTML = await fetchChar(inactive[i]);
    inactiveList.appendChild(currentLi);
  }
}
