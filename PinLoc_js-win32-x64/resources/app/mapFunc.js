
var debug = true;
var data_seg = new Array();
var x_gps;
var y_gps;
var alarmFlag = true;

//-----------net modual--------------
var net = require('net');
var clients = [];
// Start a TCP Server without listening on the port
var server = net.createServer(function (socket) {
  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort
  // Put this new client in the list
  clients.push(socket);
  // Send a nice welcome message and announce
  socket.write("Welcome " + socket.name + "\n");
  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    $('#messages').append($('<li>').text(data));
    var msg = String.fromCharCode.apply(null, new Uint16Array(data));
    if (debug) {
      console.log('data: ' + msg);
      console.log(typeof(msg));
    }

    //extract gps infomation from raw data
    data_seg = msg.split(",");
    console.log(data_seg.length);
    if(data_seg.length >= 3) {
      x_gps = gpsFix(data_seg[1],'lng');
      y_gps = gpsFix(data_seg[2],'lat');

      if (debug)
      {
        console.log('data_seg[0]: ' + data_seg[0]);
        console.log('data_seg[1]: ' + data_seg[1]);
        console.log('data_seg[2]: ' + data_seg[2]);
        console.log('data_seg[3]: ' + data_seg[3]);
        console.log('x_gps: ' + x_gps);
        console.log('y_gps: ' + y_gps);
      }
      //call cor covert function
      UpdateLoc(x_gps,y_gps,1);
    } else {
      console.log('data error! ');
    }
  });
  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    console.log('user disconnected');
    $('#messages').append($('<li>').text('client disconnected'));
  });
});

//get port value from input, and start listening
exports.startListen = function startListen(){

  var netPort = document.getElementById("inputport").value;
  if (netPort<0 || netPort> 65535 || netPort == "") {
    alert('invailed port value!');
  }
  else {
    server.listen(netPort);
    console.log('server listening on port: ' + netPort);
    $('#messages').append($('<li>').text('listening on port: ' + netPort));
  }
}


function gpsFix(x,flag){
  var degree = Math.floor(x/100);     //the final value
  var minute = x - degree*100;
  var dd =  degree + minute/60;
  switch (flag) {
    case 'lat':
      if ( dd<=90 && dd>=-90 ) {
        return dd;
      }
      else {
        alert('gpsFix():wrong lat data!');
        return 0;
      }
      break;
    case 'lng':
      if ( dd<=180 && dd>=-180 ) {
        return dd;
      }
      else {
        alert('gpsFix():wrong lng data!');
        return 0;
      }
      break;
  }
}


//------------map data set up-------------------
  var x_UST = 118.845527, y_UST =32.027782;

	var TargetArr = [
		new BMap.Point(x_UST+0.001,y_UST+0.001),
		new BMap.Point(x_UST+0.001,y_UST-0.001),
		new BMap.Point(x_UST-0.001,y_UST+0.001),
		new BMap.Point(x_UST-0.001,y_UST-0.001)
		];

	var markerArr = [
		{title:"1#",point:TargetArr[0],company:"company 1",owner:"Shijie Wang",tel:"18645788888"},
		{title:"2#",point:TargetArr[1],company:"company 2",owner:"Jun Ma",tel:"18645788888"},
		{title:"3#",point:TargetArr[2],company:"company 3",owner:"Xiaohong Zhu",tel:"18645788888"},
		{title:"4#",point:TargetArr[3],company:"company 4",owner:"Huiyan Liu",tel:"18645788888"}
		];

	var marker = new Array();  //global marker Array
	var info = new Array();    //global info Array

  var polygon_hfx;  //多边形海富巷
  var polygon_qy;   //多边形气院


//map functions
    function createMap(x,y){
      var map = new BMap.Map("dituContent");
      var center = new BMap.Point(x,y);
          map.centerAndZoom(center,16);
          window.map = map;
    }

    function initMap(x,y){
        createMap(x,y);//
        setMapEvent();//
        addMapControl();//
        addPolyline();//
    }

    function setMapEvent(){
        map.enableDragging();
        map.enableScrollWheelZoom();
        map.enableDoubleClickZoom();
        map.enableKeyboard();
    }


    function addMapControl(){

    	var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
    	map.addControl(ctrl_nav);

    	var ctrl_sca = new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_LEFT});
    	map.addControl(ctrl_sca);
    }


    var plPoints = [{style:"solid",weight:4,color:"#f00",opacity:0.6,points:["118.840766|32.030476","118.843101|32.030598","118.844287|32.034792","118.851294|32.034822","118.851401|32.024751","118.851473|32.024751","118.838861|32.02518","118.840658|32.030476"]}
		 ];

    function addPolyline(){
  		for(var i=0;i<plPoints.length;i++){
  			var json = plPoints[i];
  			var points = [];
  			for(var j=0;j<json.points.length;j++){
  				var p1 = json.points[j].split("|")[0];
  				var p2 = json.points[j].split("|")[1];
  				points.push(new BMap.Point(p1,p2));
  			}

			var line = new BMap.Polyline(points,{strokeStyle:json.style,strokeWeight:json.weight,strokeColor:json.color,strokeOpacity:json.opacity});
			map.addOverlay(line);
		  }
      polygon_hfx = new BMap.Polygon(points);
	  }


  //map init
    initMap(x_UST,y_UST);
    addMarker();


	function UpdateLoc(x,y,num)    //num represent the device number, from 1 to 4
	{
    if (num<1 || num>4) {
      alert('UpdateLoc(): device number error!');
      return;
    }
    translateCallback = function (data)
		{
		  if(data.status === 0)
		  {
        switch (num) {
          case 1:
            removeMarker0();
            break;
          case 2:
            removeMarker1();
            break;
          case 3:
            removeMarker2();
            break;
          case 4:
            removeMarker3();
            break;
        }

        i = num - 1;
				marker[i] = new BMap.Marker(data.points[0]);
				map.addOverlay(marker[i]);
        //map.setCenter(data.points[i]);  // set the center of map to the newest converted point
				var label = new window.BMap.Label(markerArr[i].title, { offset: new window.BMap.Size(10, -10) });
				marker[i].setLabel(label);
				marker[i].addEventListener("mouseover", function () { this.openInfoWindow(info[0]);	});
				info[i] = new window.BMap.InfoWindow("<p style='font-size:12px;lineheight:1.8em;'>" + markerArr[i].title + "</br>company: " + markerArr[i].company + "</br> owner: "+ markerArr[i].owner + "</br> TEL: " + markerArr[i].tel + "</br></p>");

        ptInPolygon(num,data.points[0],'hfx');
      }
    }
    //gps point to be converted
		var gpspoint = new BMap.Point(x,y);
		var convertor = new BMap.Convertor();
		var pointArr = [];
		pointArr.push(gpspoint);
		convertor.translate(pointArr, 1, 5, translateCallback);
	}

  exports.playSound = function playSound(){
    document.getElementById("sound").innerHTML='<audio autoplay="autoplay"><source src="railroad_bell.mp3" type="audio/mpeg" /><embed hidden="true" autostart="true" loop="false" src="railroad_bell.mp3" /></audio>';
  }

  exports.stopSound = function stopSound(){
    document.getElementById("sound").innerHTML='';
    document.getElementById("alarm").innerHTML='';
  }

  exports.enableAlarm = function enableAlarm(){
    alarmFlag = true;
  }
  exports.disableAlarm = function disableAlarm(){
    alarmFlag = false;
  }
  //
  function ptInPolygon(num,pt,flag){
    var result = true;
    if (!alarmFlag) {
      return result;
    }
    switch (flag) {
      case 'hfx':
        result = BMapLib.GeoUtils.isPointInPolygon(pt, polygon_hfx);
        if(result == false){
          map.setCenter(pt);
          exports.playSound();
          document.getElementById("alarm").innerHTML=num + "号设备离开主校区监控范围！";
        }
        return result;
        break;
      case 'qy':
        result = BMapLib.GeoUtils.isPointInPolygon(pt, polygon_qy);
        if(result == false){
          map.setCenter(pt);
          exports.playSound();
          alert(num + "号设备离开双龙街校区监控范围！");
        }
        return result;
        break;
    }


  }

	function searchLoc(n)
	{
		var point_T;
		//var txt = "error in js function searchLoc! n is not right!";
		switch(n)
		{
			case 1:
				point_T = TargetArr[0];
				break;
			case 2:
				point_T = TargetArr[1];
				break;
			case 3:
				point_T = TargetArr[2];
				break;
			case 4:
				point_T = TargetArr[3];
				break;
			default:
				alert(txt);
				break;
		}
		map.centerAndZoom(point_T,16);
	}

	function addMarker()
	{
		for(var i=0;i<markerArr.length;i++)
		{
      marker[i] = new BMap.Marker(TargetArr[i]);
			map.addOverlay(marker[i]);
			//marker[i].setAnimation(BMAP_ANIMATION_BOUNCE);
			var label = new window.BMap.Label(markerArr[i].title, { offset: new window.BMap.Size(10, -10) });
			marker[i].setLabel(label);
			info[i] = new window.BMap.InfoWindow("<p style='font-size:12px;lineheight:1.8em;'>" + markerArr[i].title +
      "</br>company: " + markerArr[i].company + "</br> captain: " + markerArr[i].owner +
      "</br> Tel: " + markerArr[i].tel + "</br></p>");
		}

		marker[0].addEventListener("mouseover", function () {
			this.openInfoWindow(info[0]);
		});
		marker[1].addEventListener("mouseover", function () {
			this.openInfoWindow(info[1]);
		});
		marker[2].addEventListener("mouseover", function () {
			this.openInfoWindow(info[2]);
		});
		marker[3].addEventListener("mouseover", function () {
			this.openInfoWindow(info[3]);
		});
	}

	function removeMarker0(){map.removeOverlay(marker[0]);}
  function removeMarker1(){map.removeOverlay(marker[1]);}
  function removeMarker2(){map.removeOverlay(marker[2]);}
  function removeMarker3(){map.removeOverlay(marker[3]);}
