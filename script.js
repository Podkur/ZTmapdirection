var map;        //змінна для зберігання мапи
var marker;
var markersArray = [];      //оголошення массиву маркеів
var from = new google.maps.LatLng();      //змінна для зберігання координат точки відправлення
var to = new google.maps.LatLng();        //змінна для зберігання координат точки призначення
var directionsDisplay;                    //змінна для відображення маршуту 
var directionsService = new google.maps.DirectionsService();   //клас для відправлення запиту на сервер для опрацювання маршруту
 directionsDisplay = new google.maps.DirectionsRenderer(); //присвоєння значення для візуалізації маршруту


function initialize()                     //головна функція ініціалізації коду 
{
    var myLatlng = new google.maps.LatLng(50.26487, 28.67669);  //початкові координати центру мапи
    var mapOptions = {                //задання опцій відображуваної мапи
      zoom: 13,                       //масштаб мапи
      center: myLatlng,               //центр мапи
      mapTypeId: google.maps.MapTypeId.ROADMAP    //тип мапи
    }
    
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);   //завантаження мапи у блок map_canvas
    directionsDisplay.setMap(map);
      var input = (document.getElementById('from'));
      var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon('marker1.png'/*{
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }*/);
    marker.setPosition(place.geometry.location);
    marker.setMap(map);
    marker.setVisible(true);
        var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
    });
        google.maps.event.addListener(map, 'click', function(event) {                 //обробник події для додання маркеру на мапу
        addMarker(event.latLng)});

  function addMarker(location)                            //функція для додавання маркеру на мапу
  {          
        marker = new google.maps.Marker({                      //оголошення маркеру з заданими параметрами
        position: location,
        draggable: true
        });
    markersArray.push(marker);                            //додавання маркеру в массив маркерів
    map.setCenter(location);  
      if (markersArray) 
    {
      for(i in markersArray)                              //цикл в якому відбувається призначення маркерам зобpажень та розміщення їх на мапі
      {
        markersArray[0].setMap(map);                      //відображення маркеру на мапі
        markersArray[0].setIcon('marker1.png');          //присвоєння зображення маркеру
        document.getElementById('from').value = markersArray[0].getPosition();    //передача координат маркеру у поле адреси відправки
        from = document.getElementById('from').value;       //присвоєння координат змінній from
        markersArray[1].setMap(map);                       //відображення маркеру на мапі
        markersArray[1].setIcon('marker2.png');             //присвоєння зображення маркеру
        document.getElementById('to').value = markersArray[1].getPosition();    //передача координат маркеру у поле адреси призначення
        to = document.getElementById('to').value;         //присвоєння координат змінній to
      }
    }
  }
}
  function deleteMarkers() //функція для видалення маркерів з мапи
  {    
    document.getElementById('from').value = ''; //очищення полів from та to
    document.getElementById('to').value = '';
    if (markersArray) 
    {
      for (i in markersArray)       //цикл у якому маркери видаляються з мапи
      {
          markersArray[i].setMap(null);
      }
        markersArray.length = 0;     //очищення массиву маркерів
    }
    marker.setMap(null);
    document.getElementById('marsh').style.visibility = "hidden"; //встановлення блока для відображення списку маршрутів у невидимий стан
    document.getElementById('map_canvas').style.width = "74%";    //зміна ширини блоку для відображення мапи
  }

  function Route()      //функція для побудови маршруту
  {
    var request = {     //змінна з даними для запиту на сервер
    origin: from,       //точки відправки
    destination: to,    //точка призначення
    travelMode: google.maps.TravelMode.DRIVING    //режим транспорту
  };
  directionsService.route(request, function(response, status) {       //запит на сервер
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
  document.getElementById('map_canvas').style.width = "60%";    //зміна ширини блоку для відображення мапи
  document.getElementById('marsh').style.visibility = "visible";    //встановлення блока для відображення списку маршрутів у видимий стан                                                                     //при натисканні на кнопку побудови маршруту
  }

google.maps.event.addDomListener(window, 'load', initialize);     //подія для завантаження вікна з усіма подіями
