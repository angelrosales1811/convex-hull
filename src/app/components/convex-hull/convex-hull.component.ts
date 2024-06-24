import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-convex-hull',
  templateUrl: './convex-hull.component.html',
  styleUrls: ['./convex-hull.component.css']
})
export class ConvexHullComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  display : any;
  center: google.maps.LatLngLiteral = {lat: 23.419444444444, lng: -102.145555555556};
  zoom = 5;

  moveMap(event: google.maps.MapMouseEvent) {
    if(event.latLng!= null)
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
    this.display = event.latLng.toJSON();
  }

}
