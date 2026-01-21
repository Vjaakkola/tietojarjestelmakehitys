from flask import Flask, request, Response, send_from_directory
from flask_cors import CORS

import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

import urllib.request

pyynto = urllib.request.urlopen("https://users.metropolia.fi/~peterh/mps.json")
tulos = pyynto.read().decode("utf-8")
eduskunta = json.loads(tulos)
print(len(eduskunta))
 

@app.route("/<puolue>")
def puolueen_edustajat(puolue):
    edustajalista = []
    for ed in eduskunta:
        if ed ["party"] == puolue:
            edustajalista.append(ed["first"] +" "+ ed["last"])
    return json.dumps(edustajalista)

@app.route("/nimi/<hakusana>")
def hae_edustaja_nimella(hakusana):
    tulokset = []
    hakusana = hakusana.lower()

    for ed in eduskunta:
        koko_nimi = (ed["first"] + " " + ed["last"]).lower()
        if hakusana in koko_nimi:
            tulokset.append({
                "nimi": ed["first"] + " " + ed["last"],
                "puolue": ed["party"],
                "henkilonumero": ed["personNumber"],
                "ministeri": ed["minister"],
                "syntymavuosi": ed["bornYear"],
                "vaalipiiri": ed["constituency"],
                "kuva": f"/kuvat/{ed['personNumber']}.jpg"
            })

    return json.dumps(tulokset)

@app.route("/kuvat/<path:filename>")
def kuvat(filename):
    return send_from_directory("edustajakuvat", filename)

@app.route("/ministerit")
def istuvat_ministerit():
    ministerilista = []
    for ed in eduskunta:
        if ed ["minister"] == True:
            ministerilista.append(ed["first"] +" "+ ed["last"])
    return json.dumps(ministerilista)


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
