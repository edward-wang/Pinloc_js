  var exp = require('express')();
  var http = require('http').Server(exp);
  var io = require('socket.io')(http);


  exp.get('/', function(req, res){
    res.sendFile(__dirname + '/client.html');
  });

  io.on('connection',function(socket){
    console.log('a user connected');
    $('#messages').append($('<li>').text('client connected'));

    socket.on('chat message',function(msg){
      $('#messages').append($('<li>').text(msg));
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });

    socket.on('disconnect',function(){
      $('#messages').append($('<li>').text('client disconnected'));
      console.log('user disconnected');
    });
  });

  http.listen(3000, function(){
    console.log('listening on *:3000');
  });



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

	var marker = new Array(); //
	var info = new Array(); //



    function initMap(x,y){
        createMap(x,y);//
        setMapEvent();//
        addMapControl();//
        addPolyline();//
    }



    function createMap(x,y){
		var map = new BMap.Map("dituContent");
		var center = new BMap.Point(x,y);
        map.centerAndZoom(center,16);
        window.map = map;
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
	}


	initMap(x_UST,y_UST);//�����ͳ�ʼ����ͼ
	addMarker();
	setTimeout(function(){
		UpdateLoc(x_UST,y_UST);
	}, 3000);




	//�������ݵĺ���
	function UpdateLoc(x,y)
	{
		alert('UpdateLoc called');
		//����ת����֮���Ļص�����
		translateCallback = function (data)
		{
		  if(data.status === 0)
		  {
			removeMarker();
			alert('removeMarker called!');
			for (var i = 0; i < data.points.length; i++)
			{
				marker[i] = new BMap.Marker(data.points[i]);
				map.addOverlay(marker[i]);
				var label = new window.BMap.Label(markerArr[i].title, { offset: new window.BMap.Size(10, -10) });
				marker[i].setLabel(label);
				marker[i].addEventListener("mouseover", function () { this.openInfoWindow(info[0]);	});
				info[i] = new window.BMap.InfoWindow("<p style='font-size:12px;lineheight:1.8em;'>" + markerArr[i].title + "</br>��λ��" + markerArr[i].company + "</br> �����ˣ�" + markerArr[i].owner + "</br> �绰��" + markerArr[i].tel + "</br></p>"); // ������Ϣ���ڶ���
			}
		  }
		}


		//x,y ��gps����
		gpspoint = new BMap.Point(x,y);


		var convertor = new BMap.Convertor();
		var pointArr = [];
		pointArr.push(gpspoint);
		convertor.translate(pointArr, 1, 5, translateCallback);

		setTimeout(function(){
			return 122.211 ;//����һ��double�͵�ֵ��MFC
		}, 3000);
		return 122.211 ;//����һ��double�͵�ֵ��MFC
	}

	/* ��Ŀ������ͬʱ����
	//����ת����֮���Ļص�����
	 translateCallback = function (data){
      if(data.status === 0) {
		removeMarker();
        for (var i = 0; i < data.TargetArr.length; i++) {
            marker[i] = new BMap.Marker(data.TargetArr[i]);
			map.addOverlay(new BMap.Marker(data.TargetArr[i]));
			var label = new window.BMap.Label(markerArr[i].title, { offset: new window.BMap.Size(10, -10) });
			marker[i].setLabel(label);
			info[i] = new window.BMap.InfoWindow("<p style=��font-size:12px;lineheight:1.8em;��>" + markerArr[i].title + "</br>��λ��" + markerArr[i].company + "</br> �����ˣ�" + markerArr[i].owner + "</br> �绰��" + markerArr[i].tel + "</br></p>"); // ������Ϣ���ڶ���
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
    }

	//�������ݵĺ���
	function UpdateLoc(x0,y0,x1,y1,x2,y2,x3,y3)
	{
		//x,y ��gps����
		TargetArr[0] = new BMap.Point(x0,y0);
		TargetArr[1] = new BMap.Point(x1,y1);
		TargetArr[2] = new BMap.Point(x2,y2);
		TargetArr[3] = new BMap.Point(x3,y3);

		setTimeout(function(){
			var convertor = new BMap.Convertor();
			convertor.translate(TargetArr, 1, 4, translateCallback)
		}, 1000);

		return 122.211 ;//����һ��double�͵�ֵ��MFC
	}
	*/


	//���ɵĹ���ʵ���Ͼ��ǽ����ҵĵ���Ϊ��ͼ�����ĵ�
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

	function removeMarker()
	{
		map.removeOverlay(marker[0]);
		map.removeOverlay(marker[1]);
		map.removeOverlay(marker[2]);
		map.removeOverlay(marker[3]);
	}
