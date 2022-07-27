document.addEventListener('DOMContentLoaded', () => {  

  const zoo = [24.9983469, 121.5810358]; // 預設中心點為台北市動物園

  // 建立地圖
  let zoom = 17; // 0-18
  let map = L.map('map').setView(zoo, zoom);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap', // 商用時必須要有版權出處
    zoomControl: true , // 是否秀出 - + 按鈕
  }).addTo(map);



  // 建立 marker
  const customIcon = L.icon({
    iconUrl: 'https://letswritetw.github.io/letswrite-leaflet-osm-locate/dist/dot.svg',
    iconSize: [16, 16],
  });
  const marker = L.marker(zoo, {
    icon: customIcon,
    title: '跟 <a> 的 title 一樣', // 跟 <a> 的 title 一樣
    opacity: 1.0
  }).addTo(map);



  // 跟使用者要位置
  // 參考文件：https://leafletjs.com/examples/mobile/、https://leafletjs.com/reference.html#map-locate
  map.locate({
    setView: false,
    watch: true,
    maxZoom: 18,
    enableHighAccuracy: true
  });

  // 使用者不提供位置
  function errorHandler(e) {
    console.log("e", e);
    window.alert('無法判斷您的所在位置，無法使用此功能。預設地點將為 台北市動物園');
    map.setView(zoo, 18); // 中心移到動物園
    moveTo(map); // 移動到指定座標（平滑 || 縮放 效果）
    panBy(map); // 移動 x, y 位置
  }
  map.on('locationerror', errorHandler);

  // 使用者提供位置
  function foundHandler(e) {
    console.log('e', e);
    map.panTo(e.latlng); // 移動地圖中心點到使用者所在位置
    marker.setLatLng(e.latlng); // 移動 marker
    moveTo(map); // 移動到指定座標（平滑 || 縮放 效果）
    panBy(map); // 移動 x, y 位置
  }
  map.on('locationfound', foundHandler);



  // 移動到指定座標（平滑 || 縮放 效果）
  function moveTo(map) {
    const btnPanto = document.querySelectorAll('.js-panto');
    Array.prototype.forEach.call(btnPanto, pan => {
      pan.addEventListener('click', e => {
        e.preventDefault();
        let latLng = e.target.dataset.to.split(',');
        let name = e.target.textContent;
        let toggleFly = document.getElementById('flyTo').checked;
        const popup = L.popup();
        popup
          .setLatLng(latLng)
          .setContent(`${name}`)
          .openOn(map);
        toggleFly ? map.flyTo(latLng) : map.panTo(latLng);
      })
    })
  }

  // 移動 x, y 位置
  function panBy(map) {
    const btnPanby = document.querySelectorAll('.js-panby');
    Array.prototype.forEach.call(btnPanby, pan => {
      pan.addEventListener('click', e => {
        e.preventDefault();
        let times = e.target.dataset.times;
        let point = 50 * times;
        let points = [point, point];
        map.panBy(points);
      })
    })
  }

})