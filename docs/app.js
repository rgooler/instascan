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
      var tmp = {};
      for(var s in this.scans.sort()){
        var t = this.scans[s].content;
        console.log(t);
        var c = app.scans.reduce(function(n,v){return n + (v.content === t) }, 0); 
        tmp[t] = c;
        console.log(tmp);
        }
      }
      console.log('aaaa');
      var result = [];
      for(key, value in tmp){
        result.unshift({content: key, count: value});
      }
      console.log('end');
      return result;
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
