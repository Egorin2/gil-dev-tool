const express = require('express')
const path = require('path');
const app = express()

const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database(path.join(__dirname, '/Objects.db'));

/*db.serialize(() => {
    //db.run("CREATE TABLE lorem (info TEXT)");

    

    db.each("SELECT id, object_name FROM Object", (err, row) => {
        //console.log(row.id + ": " + row.object_name);
		//console.log(row);
    });
});*/


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
})
app.post('/update', function (req, res) {
  if (!req.body) return res.sendStatus(400);
  let data = req.body;
  let str = JSON.stringify(data.coords);
  let db = new sqlite3.Database(path.join(__dirname, '/Objects.db'));
	db.serialize(() => {
    db.run("UPDATE Object SET geoj = ? WHERE id = ?", str, data.id);
    db.run("INSERT INTO fid VALUES(?)", data.fid);
  })
  db.close()
  console.log('Приняли запрос в ' + Date.now());
  res.send("yes");
})
app.post('/delete', function (req, res) {
  if (!req.body) return res.sendStatus(400);
  let data = req.body;
  let db = new sqlite3.Database(path.join(__dirname, '/Objects.db'));
	db.serialize(() => {
    db.run("INSERT INTO fid VALUES(?)", data.fid);
  })
  db.close()
  console.log('Приняли запрос в ' + Date.now());
  res.send("yes");
})
app.use('/files', express.static(path.join(__dirname, 'files')))
app.use('/script', express.static(path.join(__dirname, 'script')))
app.use('/', express.static(__dirname))
app.route('/my_area.pmtiles')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/my_area.pmtiles'));
  })
/*app.route('/script/maplibre-gl.js')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/script/maplibre-gl.js'));
  })
app.route('/script/maplibre-gl.css')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/script/maplibre-gl.css'));
  })
app.route('/script/pmtiles.js')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/script/pmtiles.js'));
  })

app.route('/objects.geojson')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/objects.geojson'));
  })
app.route('/script/main.js')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '/script/main.js'));
  })*/
app.route('/select')
  .get((req, res) => {
	let db = new sqlite3.Database(path.join(__dirname, '/Objects.db'));
	db.serialize(() => {
    db.all("SELECT id, object_name FROM Object WHERE geoj IS NULL", (err, row) => {
        
		//console.log(row);
		let str = JSON.stringify(row);
		//console.log(str);
		res.send(str);
		});	
	});
	db.close();
  })
app.route('/map')
  .get((req, res) => {
	let db = new sqlite3.Database(path.join(__dirname, '/Objects.db'));
	db.serialize(() => {
    db.all("SELECT type, geoj FROM Object WHERE geoj is not NULL", (err, row) => {
      let response = {"type": "FeatureCollection",
    "name": "papa",
    "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    },
    "features": []};
      row.forEach((elem) =>{
        let type = "";
        switch (elem.type){
          case 1: type = "Point"; break;
          case 2: type = "Polygon"; break;
          case 3: type = "LineString"; break;
        }
        let say = {
            "type": "Feature",
            "geometry": {
                "type": type,
                "coordinates": JSON.parse(elem.geoj)
            }
        }
        response.features.push(say);
      })
        
		//console.log(row);
		let str = JSON.stringify(response);
		//console.log(str);
		res.send(str);
		});	
	});
	db.close();
  })
app.get('/fid',(req, res) => {
  let db = new sqlite3.Database(path.join(__dirname, '/Objects.db'));
	db.serialize(() => {
    db.all("SELECT * FROM fid", (err, row) => {
        
		//console.log(row);
		let str = JSON.stringify(row);
		//console.log(str);
		res.send(str);
		});	
	});
	db.close();
})
app.listen(8080)
