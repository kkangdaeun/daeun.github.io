window.onload =initMap;
let map;
let health_Code=null;	
let forecast_Code=null;
let sidoName;

function initMap(){ //지도 초기화 
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
		mapOption = {
			center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
			level: 14 // 지도의 확대 레벨
		};
	// 지도를 표시할 div와  지도 옵션으로  지도를 생성
	map = new daum.maps.Map(mapContainer, mapOption);
		 map.setZoomable(false);
 	initControl();
	myLocation(); //selectLoc('서울특별시');
};

function initControl(){ //컨트롤 초기화
	// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성
	var mapTypeControl = new daum.maps.MapTypeControl();
	// 지도에 컨트롤을 추가해야 지도위에 표시
	// daum.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미
	map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);
	// //지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성
	// var zoomControl = new daum.maps.ZoomControl();
	// map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);
};

function moveTomyLocation() {
	if (navigator.geolocation) {
		// GeoLocation을 이용해서 접속 위치를 얻어옵니다
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude, // 위도
				lon = position.coords.longitude; // 경도
			var locPosition = new daum.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성
				message = '<div>현위치</div>'; // 인포윈도우에 표시될 내용
			
			// 마커와 인포윈도우를 표시
			displayMarker(locPosition, message);
			getmyLocationAddr();  
		});
    }
}

function MoveTo(a,b) { //지도 이동  함수
    // 이동할 위도 경도 위치를 생성
    var moveLatLon = new daum.maps.LatLng(a, b);
    // 지도 중심을 부드럽게 이동
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동
    map.panTo(moveLatLon);            
}

function myLocation(){ //현재위치 검색후 getmyLocationAddr
	// HTML5의 geolocation으로 사용할 수 있는지 확인
	if (navigator.geolocation) {
		// GeoLocation을 이용해서 접속 위치를 얻어옴
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude, // 위도
				lon = position.coords.longitude; // 경도
			var locPosition = new daum.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성
				message = '<div>현위치</div>'; // 인포윈도우에 표시될 내용
			
			displayMarker(locPosition, message); // 마커와 인포윈도우를 표시
			getmyLocationAddr();  

		});
	} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정
		var locPosition = new daum.maps.LatLng(33.450701, 126.570667),    
			message = 'geolocation을 사용할수 없어요..'
		displayMarker(locPosition, message);
	}
}//end MYlocation

let currentMarker = null; // 현재 표시된 마커를 저장할 변수

function displayMarker(locPosition, message) {
    var imageSrc = 'here.png',
        imageSize = new daum.maps.Size(64, 69),
        imageOption = { offset: new daum.maps.Point(27, 69) };

    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption);

    // 기존 마커가 있을 경우 지우기
    if (currentMarker) {
        currentMarker.setMap(null); // 기존 마커를 지도에서 제거
    }

    // 새로운 마커 생성 및 표시
    currentMarker = new daum.maps.Marker({
        map: map,
        position: locPosition,
        image: markerImage
    });

    currentMarker.setMap(map); // 새로운 마커 표시
    map.setCenter(locPosition); // 지도의 중심을 해당 위치로 이동
}


function getmyLocationAddr() {
    // 주소-좌표 변환 객체를 생성
    var geocoder = new daum.maps.services.Geocoder();

    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);

    function searchAddrFromCoords(coords, callback) {
        // 좌표로 주소 정보를 요청
        geocoder.coord2Address(coords, callback);
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수
    function displayCenterInfo(status, result) {
        if (status === daum.maps.services.Status.OK) {
            // alert(result[0].name1);
            document.getElementById('myloctext').innerHTML = result[0].fullName;
            selectMYLoc(result[0].name1);
        }
    }
}

function selectLoc(value) {
    var a, b;
    health_Code = null;
	forecast_Code = null;
    sidoName = value;

    switch (value) {
        case '서울특별시': health_Code = 1100000000; a = 37.5636; b = 126.98; break;
        case '부산광역시': health_Code = 2100000000; a = 35.1796; b = 129.0756; break;
        case '대구광역시': health_Code = 2200000000; a = 35.8714; b = 128.6014; break;
        case '인천광역시': health_Code = 2300000000; a = 37.4563; b = 126.7052; break;
        case '광주광역시': health_Code=2900000000; sidoName='광주'; a=35.157;b=126.8534; break;
		case '대전광역시': health_Code=3000000000;sidoName='대전';  a=36.3471;b=127.3866; break;
		case '울산광역시': health_Code=3100000000; sidoName='울산'; a=35.5354;b=129.3137; break;
		case '경기도': health_Code=4111000000;sidoName='경기';  a=37.2606;b=127.0307; break;
		case '강원도': health_Code=4211000000;sidoName='강원';  a=37.8785;b=127.7323; break;
		case '충청북도': health_Code=4311000000;sidoName='충북';  a=36.6396;b=127.4912; break;
		case '충청남도': health_Code=4413000000;sidoName='충남';  a=36.8121;b=127.1162; break;
		case '전라북도': health_Code=4511000000;sidoName='전북';  a=35.8215;b=127.15; break;
		case '전라남도': health_Code=4611000000;sidoName='전남';  a=34.8088;b=126.3944; break;
		case '경상북도': health_Code=4812100000;sidoName='경북';  a=36.016;b=129.3456; break; 
		case '경상남도': health_Code=4812000000;sidoName='경남';  a=35.2248;b=128.6841; break;
		case '제주특별자치도': health_Code=5011000000;sidoName='제주'; a=33.4963;b=126.5332; break;
    }

    const locPosition = new daum.maps.LatLng(a, b);
    displayMarker(locPosition); // 새로운 마커 표시

    MoveTo(a, b); // 지도 이동
	displayMarker(locPosition);
    parsing(); 
}

function selectMYLoc(value){ //내위치 검색후 후 지도이동 & 파싱
	var a,b;
	health_Code=null;
	forecast_Code=null;
	sidoName=value;
	switch(value){
		case '서울특별시': health_Code=1100000000;sidoName='서울';  a=37.5636;b=126.98;	break;
		case '부산광역시': health_Code=2600000000; sidoName='부산'; a=35.177;b=129.077; break;
		case '대구광역시': health_Code=2700000000;sidoName='대구';  a=35.8685;b=128.6036; break;
		case '인천광역시': health_Code=2800000000;sidoName='인천';  a=37.4532;b=126.7074; break;
		case '광주광역시': health_Code=2900000000; sidoName='광주'; a=35.157;b=126.8534; break;
		case '대전광역시': health_Code=3000000000;sidoName='대전';  a=36.3471;b=127.3866; break;
		case '울산광역시': health_Code=3100000000; sidoName='울산'; a=35.5354;b=129.3137; break;
		case '경기도': health_Code=4111000000;sidoName='경기';  a=37.2606;b=127.0307; break;
		case '강원도': health_Code=4211000000;sidoName='강원';  a=37.8785;b=127.7323; break;
		case '충청북도': health_Code=4311000000;sidoName='충북';  a=36.6396;b=127.4912; break;
		case '충청남도': health_Code=4413000000;sidoName='충남';  a=36.8121;b=127.1162; break;
		case '전라북도': health_Code=4511000000;sidoName='전북';  a=35.8215;b=127.15; break;
		case '전라남도': health_Code=4611000000;sidoName='전남';  a=34.8088;b=126.3944; break;
		case '경상북도': health_Code=4812100000;sidoName='경북';  a=36.016;b=129.3456; break; 
		case '경상남도': health_Code=4812000000;sidoName='경남';  a=35.2248;b=128.6841; break;
		case '제주특별자치도': health_Code=5011000000;sidoName='제주'; a=33.4963;b=126.5332; break;
	}
 	parsing();
}

const apiKey = "BbpUedYwbkGAKedyq1fvUmoIQdCgaNGXW1VzXWHyGs1Y5jgkyigbbB1THZj0%2B1XVdUfWNGZfCSBwl5GV98NoSw%3D%3D";
const baseUrl = "https://cors-anywhere-49h7.onrender.com/" + "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc";
const ctprvnUrl = `${baseUrl}/getCtprvnRltmMesureDnsty?pageNo=1&numOfRows=100&returnType=xml&ver=1.0&sidoName=`;

async function fetchData(url) {
    try {
        const response = await fetch(url + sidoName + `&serviceKey=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text(); // Assuming the response is in XML format
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

function parseXml(xmlString) {
    return new DOMParser().parseFromString(xmlString, "text/xml");
}

function setElementContentById(elementId, content) {
    document.getElementById(elementId).textContent = content;
}

async function parsing() {
    const ctprvnData = await fetchData(ctprvnUrl);
    if (ctprvnData) {
        const ctprvnXml = parseXml(ctprvnData);
        const ctprvnItems = ctprvnXml.querySelectorAll('item');
		console.log(ctprvnItems);
        if (ctprvnItems.length > 0) {
            setElementContentById('d_1', ctprvnItems[0].querySelector('dataTime').textContent);
            setElementContentById('d_2', ctprvnItems[0].querySelector('stationName').textContent);
			document.getElementById('d_3').innerHTML = setTotalContent(ctprvnItems[0].querySelector('khaiGrade').textContent);
			document.getElementById('d_4').innerHTML = setContentforDust(ctprvnItems[0].querySelector('pm10Grade').textContent);
			document.getElementById('d_5').innerHTML = setContentforDust(ctprvnItems[0].querySelector('o3Grade').textContent);
			document.getElementById('d_6').innerHTML = setContentforDust(ctprvnItems[0].querySelector('coGrade').textContent);
			
        }
    }
}

parsing();


function setTotalContent(text){
	var result='';
	switch(text) {
		case '0':result = '좋음'; break;
		case '1':result = '좋음'; break;
		case '2':result = '보통'; break;
		case '3':result = '나쁨'; break;
		case '4':result = '매우나쁨'; break;
		default : result='정보없음'; break;
	}
	return result;
}

function setContentforDust(text) { // 오염정보 내용 가공 함수
    var result = '';
    switch (text) {
        case '0': result = '좋음'; break;
        case '1': result = '좋음'; break;
        case '2': result = '보통'; break;
        case '3': result = '나쁨'; break;
        case '4': result = '매우나쁨'; break;
        default: result = '정보없음'; break;
    }
    return result;
}
const forecastBaseUrl = `${baseUrl}/getMinuDustWeekFrcstDspth?returnType=xml&numOfRows=100&pageNo=1`;

// 현재 날짜를 반환하는 함수
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// 대기질 예보통보 조회 함수
async function fetchForecastData() {
    const currentDate = getCurrentDate();
    const url = `${forecastBaseUrl}&searchDate=${currentDate}&serviceKey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("예보 데이터 요청 실패");
        const xmlText = await response.text();
        const xmlDoc = parseXml(xmlText);

        const items = xmlDoc.querySelectorAll("item");
        if (items.length > 0) {
            const firstItem = items[0];
            setElementContentById("d_7", firstItem.querySelector("informData").textContent);
            setElementContentById("d_8", firstItem.querySelector("informGrade").textContent);
            setElementContentById("d_9", firstItem.querySelector("informCause").textContent);
        } else {
            console.log("예보 데이터 없음");
        }
    } catch (error) {
        console.error("예보통보 데이터 처리 중 오류 발생:", error);
    }
}

// 초기화 함수 호출 시 예보 데이터도 함께 호출
window.onload = () => {
    initMap();
    parsing();
    fetchForecastData(); // 예보 정보 호출
};
