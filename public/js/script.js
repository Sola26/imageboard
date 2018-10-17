

    (function() {
        Vue.component("image-modal", {
       data: function() {
           return {
               image: {},
               description: "",
               username: ""
           };
       },
       props: ["id"],
       template: "#image-modal",
       mounted: function() {
           console.log("component has mounted");
           var self = this
           axios.get('/modal/' + this.id).then(function(response) {
               self.image = response.data

               // req.file.filename
           }).catch(function() {
               if (err) {
                   console.log("err: ", err);
               } else {
                   console.log('else!');
               }

           })
       },
       methods: {
           click: function() {
               this.$emit("popModal", "I :heart: EVERBODY");
           }
       }
    });




    new Vue({
        el: "#main",
        data: {
            imageId: null,
            title: "",
            username: "",
            desc: "",
            file: {},
            images: []
        },
        mounted: function() {
            var self = this;
            axios('/api-request').then((result)=>{
                console.log("result:", result);
                self.images = result.data.rows;

            });
        },
        updated: function() {
                console.log("updated");
        },
        methods: {
            upload: function(e) {
                var formData = new FormData;
                formData.append('file', this.file);
                formData.append('desc', this.desc);
                formData.append('title', this.title);
                formData.append('username', this.username);
                console.log(formData);
                var me = this;
                axios.post('/upload', formData).then(function(response) {
                    me.images.unshift(response.data[0])

                    // req.file.filename
                }).catch(function() {
                    if (err) {
                        console.log("err: ", err);
                    } else {
                        console.log('else!');
                    }

                })

            },
            handleFileChange: function(e) {
                this.file = e.target.files[0]


            },
            popModal: function(id) {
                console.log("id: ", id);
                this.imageId = id;
            }
       }

    })
})()
























    // set a property on the click handler of the image
    // value




    // axios.post('/comment', {
    //     imageId: this.id,
    //     comment: this.comment,
    //     username: this.username
    // })
