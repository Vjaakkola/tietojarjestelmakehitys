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


// Tee HTML-taulukko edustajista
function teeTaulukko(lista) {
    let html = "<tr><th>Kansanedustajan nimi</th></tr>"

    for (let nimi of lista) {
        html += `<tr><td>${nimi}</td></tr>`
    }

    document.getElementById("tulostaulu").innerHTML = html
}


// Alustukset
taytaPuolueLista()
document.getElementById("haenappula").addEventListener("click", haeEdustajat)
