var app = new Vue({
  el: '#app',
  filters: {
      countme(search, scans) {
         console.log('COUNTME - start');
         console.log(search);
         console.log(scans);
         var total = scans.reduce(function(n, val) {
             return n + (val.content === search);
         }, 0);
      }
  },
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  computed: {
    countedScans: function() {
      var result = [];
      for(var s in this.scans.sort()){
        var t = this.scans[s].content
        result[t] = app.scans.reduce(function(n,v){return n + (v.content === t) }, 0); 
      }
      return result;
    }
  }
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      console.log(content);
      self.scans.unshift({ content: content.replace('https://www.therarebarrel.com/product/','') });
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    }
  }
});
