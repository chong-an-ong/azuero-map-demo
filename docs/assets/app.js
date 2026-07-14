(function () {

  // MAP INIT
  const map = L.map('map-root', {
    center: [7.6, -80.5],
    zoom: 11
  });


  // BASEMAP
  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri',
      maxZoom: 18
    }
  ).addTo(map);


  // FARM STYLE
  const farmStyle = {
    color: '#2d6a4f',
    weight: 2,
    opacity: 1,
    fillColor: '#52b788',
    fillOpacity: 0.45
  };


  const hoverStyle = {
    weight: 3,
    fillOpacity: 0.7
  };


  let geojsonLayer;


  // LOAD GEOJSON
  fetch('assets/farms.geojson')
    .then(r => r.json())
    .then(data => {

      geojsonLayer = L.geoJSON(data, {

        style: farmStyle,


        onEachFeature: function(feature, layer) {

          const name = feature.properties.Name || 'Farm';

          let popupContent;


          if (name === 'Ramiro Castillo') {

            popupContent = `
              <strong>${name}</strong><br>
              <img src="https://elti.yale.edu/sites/default/files/homepage_slides/elti-banner-overlooklandscape-eva-5.jpg"
                   style="width:160px; margin:6px 0; display:block; border-radius:4px;" /><br>
              Placeholder text for this model farm goes here:
              see <a href="https://elti.yale.edu/our-stories/reviving-azuero-peninsula-through-community-driven-forest-restoration-and-sustainable"
              target="_blank">story</a> here
            `;

          } else {

            popupContent = `<strong>${name}</strong>`;

          }


          layer.bindPopup(
            popupContent,
            {closeButton:false}
          );


          let closeTimer;


          layer.on({

            mouseover: function(e) {

              clearTimeout(closeTimer);

              e.target.setStyle(hoverStyle);
              e.target.openPopup();

            },


            mouseout: function(e) {

              closeTimer = setTimeout(function() {

                geojsonLayer.resetStyle(e.target);
                e.target.closePopup();

              },1200);

            }

          });

        }

      }).addTo(map);


      map.fitBounds(
        geojsonLayer.getBounds(),
        {padding:[30,30]}
      );


    });


  // LEGEND

  const legend = L.control({
    position:'bottomright'
  });


  legend.onAdd = function() {

    const div = L.DomUtil.create(
      'div',
      'legend'
    );


    div.innerHTML = `

      <div class="legend-title">
        ELTI Azuero Peninsula
      </div>

      <div class="legend-item">

        <div class="legend-box"
          style="background:#52b788;border:2px solid #2d6a4f;">
        </div>

        <span>Model farm</span>

      </div>

      <div style="margin-top:6px;font-size:11px;color:#666;">
        Click or hover a polygon<br>
        to see the farm name
      </div>

    `;


    return div;

  };


  legend.addTo(map);


})();