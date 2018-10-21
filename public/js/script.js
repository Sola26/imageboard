(function() {
  Vue.component("image-modal", {
    data: function() {
      return {
        image: {},
        description: "",
        user: "",
        url: "",
        title: "",
        date: "",
        comment: "",
        commenter: "",
        commentsArr: []
      };
    },
    props: ["id"],
    template: "#image-modal",
    watch: {
      imageId: function() {
        self.heading = response.data.title;
        self.user = response.data.name;
        self.description = response.data.description;
        self.url = response.data.url;
        self.date = response.data.created_at;
      }
    },
    mounted: function() {
      console.log("component has mounted");
      var self = this;
      axios
        .get("/modal/" + this.id)
        .then(function(response) {
          self.heading = response.data.title;
          self.user = response.data.name;
          self.description = response.data.description;
          self.url = response.data.url;
          self.date = response.data.created_at;
        })
        .catch(function() {
          if (err) {
            console.log("err: ", err);
          } else {
            console.log("else!");
          }
        });
      axios.get("/comment/" + this.id).then(function(comments) {
        console.log("COMMENTS: ", comments.data);
        self.commentsArr = comments.data;
      });
    },
    methods: {
      close: function() {
        this.$emit("close");
      },

      addComment: function() {
        var self = this;
        axios
          .post("/comment/add", {
            commenter: this.commenter,
            comment: this.comment,
            id: this.id
          })
          .then(function(response) {
            self.commentsArr.unshift(response.data.rows[0]);
          })
          .catch(function(err) {
            console.log("COMMENT ERR: ", err.message);
          });
      }
    }
  });

  new Vue({
    el: "#main",
    data: {
      imageId: location.hash.slice(1),
      title: "",
      username: "",
      desc: "",
      file: {},
      images: [],
      hasMore: true
    },
    mounted: function() {
      var self = this;
      addEventListener("hashchange", function() {
        self.imageId = location.hash.slice(1);
        if (location.hash.slice(1) != "#null") {
          return;
        }
      });

      axios("/api-request").then(result => {
        var self = this;
        console.log("result:", result);
        self.images = result.data.rows;
      });
    },
    updated: function() {
      console.log("updated");
    },
    methods: {
      upload: function(e) {
        var formData = new FormData();
        formData.append("file", this.file);
        formData.append("desc", this.desc);
        formData.append("title", this.title);
        formData.append("username", this.username);
        console.log("formData: ", formData);
        var me = this;
        axios
          .post("/upload", formData)
          .then(function(response) {
            me.images.unshift(response.data[0]);

            // req.file.filename
          })
          .catch(function() {
            if (err) {
              console.log("err: ", err);
            } else {
              console.log("else!");
            }
          });
      },
      handleFileChange: function(e) {
        this.file = e.target.files[0];
      },
      popModal: function(id) {
        console.log("id: ", id);
        this.imageId = id;
      },
      getMore: function() {
        var self = this;
        axios
          .get("/images/more/" + self.images[self.images.length - 1].id)
          .then(function(response) {
            self.images.push.apply(self.images, response.data);
            if (self.images[self.images.length - 1].id == 1) {
              self.hasMore = false;
            }
          })
          .catch(err => {
            console.log("err in getMore: ", err);
          });
      },
      closeModal: function() {
        // var s = location.hash.slice(1);
        this.imageId = null;
        // s = null;
      }
    }
  });
})();

// if (self.images[self.images.length-1].) {
//
// }

// set a property on the click handler of the image
// value

// axios.post('/comment', {
//     imageId: this.id,
//     comment: this.comment,
//     username: this.username
// })

// location.hash = "" /the hash
