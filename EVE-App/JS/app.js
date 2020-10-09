const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let jobsData;

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
    jobsData = await fetchApi(accessToken);
    await sortJobs(jobsData);
    await fetchCorpMembers(accessToken);
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

async function fetchApi(accessToken) {
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
  console.log(data);
  return data;
}

async function sortJobs(jobsData) {
  let length = jobsData.length;

  for (i = 0; i < length; i++) {
    let date = new Date(jobsData[i].end_date);
    let installer = await fetchChar(jobsData[i].installer_id);
    let currentJob = document.createElement("div");
    currentJob.innerHTML = date + " " + installer;
    mainSection.appendChild(currentJob);
  }
 
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
  // console.log(data)
  return data.name;
}




async function fetchCorpMembers(accessToken){
  const url = "https://esi.evetech.net/latest/corporations/98239242/members/?datasource=tranquility"
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await dataFetch.json();
  return sortCorp(data)
}

async function sortCorp (corpData){
        let length = corpData.length
        let corpMembers = []
        for (i = 0; i < length; i++) {
          corpMembers.push(corpData[i])
        }
        
        return corpMembers
}


  // activeNotice.innerHTML = jobsData["0"].end_date;
    // let currentDate = new Date();
    // let jobEnd = new Date(jobsData["0"].end_date);
    // console.log(jobEnd);
    // console.log(jobsData.length);
    // if (currentDate > jobEnd) {
    //   console.log("job complete");
    // }
    // // mainSection.appendChild(activeNotice);