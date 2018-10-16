// (function() {
//     new Vue({
//         el: '#app',
//         data: {
//             images: []
//         },
//         mounted: function() {
//             var self = this;
//             axios.get('/api-request').then(function(response) {
//                 self.images = result.data.rows;
//             }).catch(function(err) {
//
//             });
//         }
//         ,
    //     methods: {
    //         handleClick: function(e) {
    //             console.log('submits ' + this.greetee);
    //         },
    //         handleMousedown: function(city) {
    //             console.log(city.name, city.country);
    //         }
    //     }
    // });
// })();



(function() {


new Vue({
    el: "#main",
    data: {
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


        }
    }
})
})()
