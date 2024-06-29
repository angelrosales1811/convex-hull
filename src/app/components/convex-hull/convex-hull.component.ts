import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-convex-hull',
  templateUrl: './convex-hull.component.html',
  styleUrls: ['./convex-hull.component.css'],
})
export class ConvexHullComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;

  display: any;
  center: google.maps.LatLngLiteral = {
    lat: 23.419444444444,
    lng: -102.145555555556,
  };
  zoom = 4;
  massiveUpdatemarkers: any = [];
  massiveUpdate: any = [];
  vertices: any = [];

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  onFileSelected(event: any) {
    this.massiveUpdatemarkers = [];
    let upLoadFIle = event.target.files[0];
    console.log(upLoadFIle);
    let reader = new FileReader();
    reader.onload = (e) => {
      // Cuando el archivo se terminó de cargar
      //@ts-ignore
      this.massiveUpdate = this.csvJSON(e.target.result);
      this.massiveUpdate.forEach((client: any) => {
        this.massiveUpdatemarkers.push({
          lat: parseFloat(client.lat),
          lng: parseFloat(client.lng),
          desc: client.desc,
          // nCliente: client['IdCliente'],
          // draggable: false,
          // animation: '',
          // icon: 'http://maps.google.com/mapfiles/kml/pal5/icon13.png'
        });
      });
      console.log(this.massiveUpdate);
    };
    reader.readAsBinaryString(upLoadFIle);
  }

  csvJSON(csv: any) {
    var lines = csv.replace(/\r/g, '').split('\n');
    var result = [];
    var headersTemp = lines[0].split(',');

    var headers: any = [];

    headersTemp.forEach((element: any) => {
      headers.push(element.trim());
    });
    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(',');
      for (var j = 0; j < headers.length; j++) {
        //@ts-ignore
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result; //JSON
  }

  convexHull2(points: any[], n: number) {
    // There must be at least 3 points
    if (n < 3) return;

    // Initialize Result
    let hull = [];

    // Find the leftmost point
    let l = 0;
    for (let i = 1; i < n; i++) if (points[i].lng < points[l].lng) l = i;

    // Start from leftmost point, keep moving
    // counterclockwise until reach the start point
    // again. This loop runs O(h) times where h is
    // number of points in result or output.
    let p = l,
      q;
    do {
      // Add current point to result
      hull.push({
        lat: parseFloat(points[p].lat),
        lng: parseFloat(points[p].lng),
      });

      // Search for a point 'q' such that
      // orientation(p, q, x) is counterclockwise
      // for all points 'x'. The idea is to keep
      // track of last visited most counterclock-
      // wise point in q. If any point 'i' is more
      // counterclock-wise than q, then update q.
      q = (p + 1) % n;

      for (let i = 0; i < n; i++) {
        // If i is more counterclockwise than
        // current q, then update q
        if (this.OrientationMatch(points[p], points[i], points[q]) == 2) q = i;
      }

      // Now q is the most counterclockwise with
      // respect to p. Set p as q for next iteration,
      // so that q is added to result 'hull'
      p = q;
    } while (p != l); // While we don't come to first
    // point
    this.zoom = 10;
    return hull;
  }

  OrientationMatch(check1: any, check2: any, check3: any) {
    let val =
      (check2.lat - check1.lat) * (check3.lng - check2.lng) -
      (check2.lng - check1.lng) * (check3.lat - check2.lat);
    if (val == 0) return 0;
    return val > 0 ? 1 : 2;
  }

  polygon() {
    this.vertices = this.convexHull2(
      this.massiveUpdate,
      this.massiveUpdate.length
    );

    let latProm = 0;
    let lngProm = 0;
    this.vertices.forEach((element: any) => {
      latProm +=element.lat;
      lngProm +=element.lng;
    });

    this.center={
      lat: latProm/this.vertices.length,
      lng: lngProm/this.vertices.length,
    };
    this.zoom = 10;
    console.log(this.vertices);
    console.log(this.center);
  }


  downloadCSV() {
    let arrayFormatted: any[];
  
      arrayFormatted = this.vertices.map((item:any) => {
        return {
          "lat": item.lat,
          "lng": item.lng,
        };
      })
    
    this.exportToCsv("vertices.csv", arrayFormatted)
  }

  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);

    let csvData =
      keys.join(separator) +
      '\n' +
      rows
        .map(row => {
          return keys
            .map(k => {
              //@ts-ignore
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell =
                // cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
                cell instanceof Date ? cell.toLocaleString() : cell.toString();
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    csvData = csvData + '\n';


    const blob = new Blob([csvData], { type: 'text/html; charset=UTF-8' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

  }

  ejemplo() {
    let arrayFormatted = [{
      "desc": "1",
      "lat": "19.04540361",
      "lng": "-98.12308735"
  },
  {
      "desc": "2",
      "lat": "19.0452065",
      "lng": "-98.1233554"
  },
  {
      "desc": "3",
      "lat": "19.0462946",
      "lng": "-98.1241108"
  },
  {
      "desc": "4",
      "lat": "19.0484734",
      "lng": "-98.1246307"
  },
  {
      "desc": "5",
      "lat": "19.0483034",
      "lng": "-98.1246942"
  },
  {
      "desc": "6",
      "lat": "19.0468147",
      "lng": "-98.1259039"
  },
  {
      "desc": "7",
      "lat": "19.0457619",
      "lng": "-98.1337574"
  },
  {
      "desc": "8",
      "lat": "19.0506798",
      "lng": "-98.1419971"
  },
  {
      "desc": "9",
      "lat": "19.0611891",
      "lng": "-98.1366756"
  },
  {
      "desc": "10",
      "lat": "19.0587768",
      "lng": "-98.1280067"
  },
  {
      "desc": "11",
      "lat": "19.0546823",
      "lng": "-98.1123173"
  },
  {
      "desc": "12",
      "lat": "19.0587768",
      "lng": "-98.1244876"
  },
  {
      "desc": "13",
      "lat": "19.0413009",
      "lng": "-98.1057999"
  },
  {
      "desc": "14",
      "lat": "19.0669818",
      "lng": "-98.1173052"
  },
  {
      "desc": "15",
      "lat": "19.0458535",
      "lng": "-98.1068345"
  },
  {
      "desc": "16",
      "lat": "19.0207472",
      "lng": "-98.1295716"
  },
  {
      "desc": "17",
      "lat": "19.0279749",
      "lng": "-98.1419776"
  },
  {
      "desc": "18",
      "lat": "19.0353225",
      "lng": "-98.1546889"
  },
  {
      "desc": "19",
      "lat": "19.0429236",
      "lng": "-98.1578636"
  },
  {
      "desc": "20",
      "lat": "19.0465189",
      "lng": "-98.1522675"
  }];



    this.exportToCsv('Ejemplo_coordenadas.csv', arrayFormatted)
  }

}
