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
      var tmp = {};
      for(var s in this.scans.sort()){
        var t = this.scans[s].content;
        var c = app.scans.reduce(function(n,v){return n + (v.content === t) }, 0); 
        tmp[t] = c;
        }
      var result = [];
      for(key in tmp){
        result.unshift({content: key, count: tmp[key]});
      }
      return result;
    }
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      self.scans.unshift({ content: content.replace('https://www.therarebarrel.com/product/','') });
      var audio = new Howl({ src: ['beep.webm']});
      audio.play();
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
