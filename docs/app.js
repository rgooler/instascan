var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  computed: {
    countedScans: function() {
      console.log('countedScans');
      var result = [];
      var used = [];
      for(var s in this.scans.sort()){
        var t = this.scans[s].content;
        console.log(used.indexOf(t));
        if(used.indexOf(t) == 0) {
          used.unshift(t);
          console.log(t);
          var c = app.scans.reduce(function(n,v){return n + (v.content === t) }, 0); 
          result.unshift({count: c, name: t});
          console.log(result);
        }
      }
      console.log(result);
      console.log('end');
      return result.sort();
    }
  },
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
