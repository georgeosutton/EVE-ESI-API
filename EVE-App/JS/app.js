const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let jobsData

let activeNotice = document.createElement("div");



let mainSection = document.querySelector(".main-section")





if (urlParams.get('code')){
    generateToken()
}

async function generateToken() {
  const code = urlParams.get('code');
  const url = 'https://login.eveonline.com/v2/oauth/token';
  const auth = "N2I4MjkyYjRjYjNlNGJkN2JjMzUwZmI0ZDFhZWRhMjQ6c2l5Z21vakx2bFJjYkgxN1YzQTFiRk5uMmFUdlNiQ3BmRzlLZk5iNQ=="
  const  data = await authApi(url, code, auth);
  const accessToken = data.access_token;
  const refreshToken = data.refresh_token;


  if (accessToken){
    jobsData = await fetchApi(accessToken)
 
    activeNotice.innerHTML = jobsData["0"].end_date;
    
    mainSection.appendChild(activeNotice)}
  
}


async function authApi (url, code, auth) {
  const dataFetch = await fetch(url, {
    method: 'POST',
    headers: {
     "Content-type": "application/x-www-form-urlencoded", 'Authorization': `Basic ${auth}`, 'Host': 'login.eveonline.com'
   },
   body: `grant_type=authorization_code&code=${code}`
  })
  const data = await dataFetch.json();
  
  return data;
}



async function fetchApi(accessToken) {
  const dataFetch = await fetch("https://esi.evetech.net/latest/corporations/98239242/industry/jobs/?datasource=tranquility&include_completed=false&page=1", {
    method: "GET",
    headers: {
       'accept': "application/json",
       'authorization': `Bearer ${accessToken}`
    }
  });
  const data = await dataFetch.json();
  console.log(data)
  return data;
}



