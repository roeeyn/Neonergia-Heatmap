
// Initialize Cloud Firestore through Firebase
var config = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "https://neoenergia3-a687d.firebaseio.com",
  projectId: "neoenergia3-a687d"
};

firebase.initializeApp(config);
const db = firebase.firestore();

// This example requires the Visualization library. Include the libraries=visualization
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization">

var map, heatmap;

async function initMap() {

  const points = getPoints()

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: { lat: -8.057838, lng: -34.882897 },
    mapTypeId: 'satellite'
  });

  // Define the LatLng coordinates for the polygon's path.
  var recifeCoords = [
    { lat: -8.043496, lng: -34.868936},
    { lat: -8.051272, lng: -34.873270},
    { lat: -8.059260, lng: -34.874300},
    { lat: -8.063934, lng: -34.875244},
    { lat: -8.067886, lng: -34.872755},
    { lat: -8.055011, lng: -34.867219},
    { lat: -8.050039, lng: -34.867562},
    { lat: -8.044728, lng: -34.865588},

  ];

  // Construct the polygon.
  var bermudaTriangle = new google.maps.Polygon({
    paths: recifeCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#0000FF',
    fillOpacity: 0.15
  });
  bermudaTriangle.setMap(map);
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

function renderMap(snapshot) {
  var returnArr = [];

  snapshot.docs.forEach(doc => {
    const { latitude, longitude } = doc.data().location;
    // console.log('Adding poit to array', latitude, longitude);
    returnArr.push(new google.maps.LatLng(latitude, longitude));
  })

  heatmap ? heatmap.setMap(null) : null;

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: returnArr,
    map: map
  });

  heatmap.setMap(map);

  return returnArr;
}

// Heatmap data: 500 Points
function getPoints() {

  db.collection('fails').onSnapshot(snapshot => {
    // console.log('*******************************************************')
    // console.log('RERNDERING MAP: ', snapshot.docChanges().map((cosa, index) => console.log('LOL', cosa.type, ':', index)))
    // console.log('*******************************************************')
    renderMap(snapshot)
  });
}
