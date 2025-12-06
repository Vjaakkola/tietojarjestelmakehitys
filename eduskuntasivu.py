from flask import Flask, request, Response
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

@app.route("/hello/<personid>")
def hello(personid):
    for ed in eduskunta:
        if ed ["personNumber"] == int(personid):
            return json.dumps(ed)
    

@app.route("/<puolue>")
def puolueen_edustajat(puolue):
    edustajalista = []
    for ed in eduskunta:
        if ed ["party"] == puolue:
            edustajalista.append(ed["first"] +" "+ ed["last"])
    return json.dumps(edustajalista)

@app.route("/ministerit")
def istuvat_ministerit():
    ministerilista = []
    for ed in eduskunta:
        if ed ["minister"] == True:
            ministerilista.append(ed["first"] +" "+ ed["last"])
    return json.dumps(ministerilista)

@app.route('/summa')
def summa():
    args = request.args
    print(args)

    luku1 = float(args.get("luku1"))
    luku2 = float(args.get("luku2"))
    summa = luku1+luku2

    vastaus = {
        "luku1" : luku1,
        "luku2" : luku2,
        "summa" : summa
    }

    return vastaus

@app.route('/restsumma/<luku1>/<luku2>')
def restsumma(luku1, luku2):
    try:
        luku1 = float(luku1)
        luku2 = float(luku2)
        summa = luku1+luku2

        tilakoodi = 200
        vastaus = {
            "status": tilakoodi,
            "luku1": luku1,
            "luku2": luku2,
            "summa": summa
        }

    except ValueError:
        tilakoodi = 400
        vastaus = {
            "status": tilakoodi,
            "teksti": "Virheellinen yhteenlaskettava"
        }

    jsonvast = json.dumps(vastaus)
    return Response(response=jsonvast, status=tilakoodi, mimetype="application/json")

@app.errorhandler(404)
def page_not_found(virhekoodi):
    vastaus = {
        "status" : "404",
        "teksti" : "Virheellinen päätepiste"
    }
    jsonvast = json.dumps(vastaus)
    return Response(response=jsonvast, status=404, mimetype="application/json")


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)
