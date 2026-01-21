// Lataa dropdowniin puoluekoodit
function taytaPuolueLista() {
    const puolueet = [
        "sd", "kok", "vihr", "ps", "kesk", "vas", "r", "kd", "liik"
    ]

    let html = ""
    for (let p of puolueet) {
        html += `<option value="${p}">${p}</option>`
    }
    document.getElementById("puolueet").innerHTML = html
}



// Hae valitun puolueen edustajat
async function haeEdustajat() {
    console.log("Hae edustajat kutsuttu")

    let puolue = document.getElementById("puolueet").value
    let url = `http://localhost:3000/${puolue}`

    try {
        const vastaus = await fetch(url)
        const json = await vastaus.json()

        console.log("DEBUG:", json)
        teeTaulukko(json)

    } catch (e) {
        console.log("Virhe:", e)
    }
}

// Hae kirjotetun edustajan tiedot
async function haeNimella() {
  const haku = document.getElementById("nimihaku").value.trim();
  if (!haku) return;

  const url = `http://127.0.0.1:3000/nimi/${encodeURIComponent(haku)}`;

  try {
    const vastaus = await fetch(url);
    const data = await vastaus.json(); // [{nimi, puolue, henkilonumero, ministeri}]
    naytaNimiHakuTaulukko(`Nimihaku: "${haku}"`, data);
  } catch (e) {
    console.log("Virhe nimihauissa:", e);
  }
}



// Tee HTML-taulukko edustajista
function teeTaulukko(lista) {
    let html = "<tr><th>Kansanedustajan nimi</th></tr>"

    for (let nimi of lista) {
        html += `<tr><td>${nimi}</td></tr>`
    }

    document.getElementById("tulostaulu").innerHTML = html
}

// näytä thml taulukko edustajan tiedoista
function naytaNimiHakuTaulukko(otsikko, lista) {
  const ots = document.getElementById("tulosotsikko");
  if (ots) ots.textContent = otsikko;

  let html = `
    <tr>
      <th>Kuva</th>
      <th>Nimi</th>
      <th>Puolue</th>
      <th>ID</th>
      <th>Ministeri</th>
      <th>Syntymävuosi</th>
      <th>Vaalipiiri</th>
    </tr>`;

  if (!lista || lista.length === 0) {
    html += `<tr><td colspan="7">(ei tuloksia)</td></tr>`;
  } else {
    for (const r of lista) {
        

      html += `
        <tr>
        <td>${r.kuva ? `<img class="edkuva" src="http://127.0.0.1:3000${r.kuva}" alt="${r.nimi}">` : ""}</td>
          <td>${r.nimi}</td>
          <td>${r.puolue}</td>
          <td>${r.henkilonumero}</td>
          <td>${r.ministeri ? "Kyllä" : "Ei"}</td>
          <td>${r.syntymavuosi ?? ""}</td>
          <td>${r.vaalipiiri ?? ""}</td>
        </tr>`;
    }
  }

  document.getElementById("tulostaulu").innerHTML = html;
}



// Alustukset
taytaPuolueLista()
document.getElementById("haenappula").addEventListener("click", haeEdustajat)

document
  .getElementById("haeNimiNappi")
  .addEventListener("click", haeNimella);
