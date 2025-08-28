(function () {
  function renderHeaderFooter() {
    var header = document.getElementById("app-header");
    var footer = document.getElementById("app-footer");
    var path = location.pathname.split("/").pop() || "index.html";

    function link(href, label) {
      var active = href === path ? " class=\"active\"" : "";
      return (
        "<a" + active + " href=\"" + href + "\" aria-label=\"" + label + "\">" +
        label +
        "</a>"
      );
    }

    if (header) {
      header.innerHTML =
        "\n<div class=\"header\">\n  <nav class=\"nav\">\n    <div class=\"brand\">\n      <div class=\"logo\"></div>\n      <span>Smart Jharkhand Tourism</span>\n    </div>\n    <div class=\"links\">\n      " +
        [
          link("index.html", "Home"),
          link("ai.html", "AI Companion"),
          link("map.html", "Eco-Map"),
          link("itinerary.html", "Itinerary & Booking"),
          link("marketplace.html", "Marketplace"),
          link("culture.html", "Culture & Eco"),
          link("dashboard.html", "My Dashboard"),
          link("admin.html", "Admin"),
        ].join("") +
        "\n    </div>\n  </nav>\n</div>";
    }

    if (footer) {
      footer.innerHTML =
        "\n<div class=\"footer\">\n  <div class=\"main\">\n    <div>\n      <strong>Jharkhand Tourism</strong> · <span class=\"badge\">Beta</span>\n    </div>\n    <div>Built for nature, culture, community.</div>\n  </div>\n</div>";
    }
  }

  function bannerRotator() {
    var rotators = document.querySelectorAll(".banner-rotator");
    rotators.forEach(function (r) {
      var imgs = r.querySelectorAll("img");
      var i = 0;
      if (imgs.length === 0) return;
      imgs[0].classList.add("active");
      setInterval(function () {
        imgs[i].classList.remove("active");
        i = (i + 1) % imgs.length;
        imgs[i].classList.add("active");
      }, 4000);
    });
  }

  function initAISearch() {
    var form = document.getElementById("ai-search-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = (document.getElementById("ai-search-input") || {}).value || "";
      var url = "itinerary.html?q=" + encodeURIComponent(q);
      location.href = url;
    });
    var mic = document.getElementById("ai-search-voice");
    if (mic && "webkitSpeechRecognition" in window) {
      var r = new webkitSpeechRecognition();
      r.continuous = false;
      r.lang = "en-IN";
      r.interimResults = false;
      mic.addEventListener("click", function () {
        r.start();
      });
      r.onresult = function (evt) {
        var t = evt.results[0][0].transcript;
        var input = document.getElementById("ai-search-input");
        if (input) {
          input.value = t;
        }
      };
    }
  }

  function initQuickAccess() {
    var sos = document.getElementById("qa-sos");
    if (sos) {
      sos.addEventListener("click", function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (pos) {
              var lat = pos.coords.latitude.toFixed(5);
              var lon = pos.coords.longitude.toFixed(5);
              var msg =
                "SOS! I need help. My location: https://maps.google.com/?q=" +
                lat +
                "," +
                lon;
              var tel = "tel:112";
              alert("Dialing helpline 112 and copying location to clipboard.");
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(msg);
              }
              location.href = tel;
            },
            function () {
              alert("Location unavailable. Dialing 112.");
              location.href = "tel:112";
            }
          );
        } else {
          location.href = "tel:112";
        }
      });
    }

    var ccSelect = document.getElementById("cc-select");
    var ccInput = document.getElementById("cc-in");
    var ccOut = document.getElementById("cc-out");
    if (ccSelect && ccInput && ccOut) {
      fetch("https://api.exchangerate.host/latest?base=INR")
        .then(function (r) {
          return r.json();
        })
        .then(function (d) {
          var rates = d.rates || {};
          ["USD", "EUR", "GBP", "NPR", "BDT"].forEach(function (code) {
            var o = document.createElement("option");
            o.value = code;
            o.textContent = code;
            ccSelect.appendChild(o);
          });
          function recalc() {
            var amt = parseFloat(ccInput.value || "0");
            var code = ccSelect.value;
            var rate = rates[code] || 0;
            ccOut.textContent = (amt * rate).toFixed(2) + " " + code;
          }
          ccInput.addEventListener("input", recalc);
          ccSelect.addEventListener("change", recalc);
        })
        .catch(function () {
          if (ccOut) ccOut.textContent = "Offline";
        });
    }

    var wOut = document.getElementById("weather-out");
    if (wOut) {
      function renderWeather(lat, lon) {
        fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=" +
            lat +
            "&longitude=" +
            lon +
            "&current_weather=true"
        )
          .then(function (r) {
            return r.json();
          })
          .then(function (d) {
            var cw = d.current_weather || {};
            wOut.textContent =
              (cw.temperature || "--") + "°C, wind " + (cw.windspeed || "--") + " km/h";
          })
          .catch(function () {
            wOut.textContent = "Weather offline";
          });
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            renderWeather(pos.coords.latitude, pos.coords.longitude);
          },
          function () {
            renderWeather(23.36, 85.33);
          }
        );
      } else {
        renderWeather(23.36, 85.33);
      }
    }
  }

  function registerSW() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/jharkhand-tourism/sw.js");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHeaderFooter();
    bannerRotator();
    initAISearch();
    initQuickAccess();
    registerSW();
  });
})();

(function(){
  function renderHeaderFooter(){
    var header = document.getElementById('app-header');
    var footer = document.getElementById('app-footer');
    var path = location.pathname.split('/').pop() || 'index.html';
    function link(href,label){
      var active = (href===path) ? ' class="active"' : '';
      return '<a'+active+' href="'+href+'" aria-label="'+label+'">'+label+'</a>';
    }
    if(header){
      header.innerHTML = '\n<div class="header">\n  <nav class="nav">\n    <div class="brand">\n      <div class="logo"></div>\n      <span>Smart Jharkhand Tourism</span>\n    </div>\n    <div class="links">\n      '+[
        link('index.html','Home'),
        link('ai.html','AI Companion'),
        link('map.html','Eco-Map'),
        link('itinerary.html','Itinerary & Booking'),
        link('marketplace.html','Marketplace'),
        link('culture.html','Culture & Eco'),
        link('dashboard.html','My Dashboard'),
        link('admin.html','Admin')
      ].join('')+'\n    </div>\n  </nav>\n</div>';
    }
    if(footer){
      footer.innerHTML = '\n<div class="footer">\n  <div class="main">\n    <div>\n      <strong>Jharkhand Tourism</strong> · <span class="badge">Beta</span>\n    </div>\n    <div>Built for nature, culture, community.</div>\n  </div>\n</div>';
    }
  }

  function bannerRotator(){
    var rotators = document.querySelectorAll('.banner-rotator');
    rotators.forEach(function(r){
      var imgs = r.querySelectorAll('img');
      var i = 0; if(imgs.length===0) return; imgs[0].classList.add('active');
      setInterval(function(){
        imgs[i].classList.remove('active');
        i = (i+1) % imgs.length;
        imgs[i].classList.add('active');
      }, 4000);
    });
  }

  function initAISearch(){
    var form = document.getElementById('ai-search-form');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var q = (document.getElementById('ai-search-input')||{}).value||'';
      var url = 'itinerary.html?q='+encodeURIComponent(q);
      location.href = url;
    });
    var mic = document.getElementById('ai-search-voice');
    if(mic && 'webkitSpeechRecognition' in window){
      var r = new webkitSpeechRecognition();
      r.continuous = false; r.lang = 'en-IN'; r.interimResults = false;
      mic.addEventListener('click', function(){ r.start(); });
      r.onresult = function(evt){
        var t = evt.results[0][0].transcript; var input = document.getElementById('ai-search-input');
        if(input){ input.value = t; }
      }
    }
  }

  function initQuickAccess(){
    var sos = document.getElementById('qa-sos');
    if(sos){
      sos.addEventListener('click', function(){
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition(function(pos){
            var lat = pos.coords.latitude.toFixed(5);
            var lon = pos.coords.longitude.toFixed(5);
            var msg = 'SOS! I need help. My location: https://maps.google.com/?q='+lat+','+lon;
            var tel = 'tel:112';
            alert('Dialing helpline 112 and copying location to clipboard.');
            navigator.clipboard && navigator.clipboard.writeText(msg);
            location.href = tel;
          }, function(){ alert('Location unavailable. Dialing 112.'); location.href='tel:112'; });
        } else {
          location.href = 'tel:112';
        }
      });
    }

    var ccSelect = document.getElementById('cc-select');
    var ccInput = document.getElementById('cc-in');
    var ccOut = document.getElementById('cc-out');
    if(ccSelect && ccInput && ccOut){
      fetch('https://api.exchangerate.host/latest?base=INR').then(function(r){return r.json()}).then(function(d){
        var rates = d.rates||{}; ['USD','EUR','GBP','NPR','BDT'].forEach(function(code){
          var o=document.createElement('option'); o.value=code; o.textContent=code; ccSelect.appendChild(o);
        });
        function recalc(){
          var amt = parseFloat(ccInput.value||'0'); var code = ccSelect.value; var rate = rates[code]||0; ccOut.textContent = (amt*rate).toFixed(2)+' '+code;
        }
        ccInput.addEventListener('input',recalc); ccSelect.addEventListener('change',recalc);
      }).catch(function(){ ccOut && (ccOut.textContent='Offline'); });
    }

    var wOut = document.getElementById('weather-out');
    if(wOut){
      function renderWeather(lat,lon){
        fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current_weather=true').then(function(r){return r.json()}).then(function(d){
          var cw = d.current_weather || {}; wOut.textContent = (cw.temperature||'--')+'°C, wind '+(cw.windspeed||'--')+' km/h';
        }).catch(function(){ wOut.textContent = 'Weather offline'; });
      }
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){renderWeather(pos.coords.latitude,pos.coords.longitude)}, function(){renderWeather(23.36,85.33)});
      } else { renderWeather(23.36,85.33); }
    }
  }

  function registerSW(){
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('/jharkhand-tourism/sw.js'); }
  }

  document.addEventListener('DOMContentLoaded', function(){
    renderHeaderFooter();
    bannerRotator();
    initAISearch();
    initQuickAccess();
    registerSW();
  });
})();
