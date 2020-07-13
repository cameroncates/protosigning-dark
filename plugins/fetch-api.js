import Vue from 'vue'
import { auth, db, storage } from '@/services/firebase'

Vue.mixin({
    methods:{
        firebase_remove(ref, callback) {
            db.ref(ref).remove()
            .then(function() {
                callback('success')
            })
        },
        async $api_fetch2(ref, limit = 50, callback){
            let db_ref = db.ref(ref)
            await db_ref.orderByKey().limitToFirst(limit).on("child_added", (snap) => {
                console.log(snap.key)
                callback({ ...snap.val(), key: snap.key } )
            })
        },
        async $api_fetch(ref, callback){
            let db_ref = db.ref(ref)
            await db_ref.on("child_added", (snap) => {
                let obj = snap.val(),
                    data = []
                for(let key in obj) {
                    data.push({...obj[key], key})
                }
                callback(data, snap.key)
            })
        },
        async api_insert(ref, metadata, callback) {
            db.ref(ref).push(metadata)
            .then((data) => {
                // console.log(data, 'new project created success')
                callback(data.key)
            })
            .catch(err => {
                console.log('api insert err:', err)
            })
        },

        async api_fetch(ref, callback) {
            let db_ref = db.ref(ref)
            await db_ref.on('value', (snap) => {
                callback(snap.val())
            })
        },
        async api_fetch_one(ref, one, callback) {
            let db_ref = db.ref(ref)
            await db_ref.on('value', (snap) => {
                one = snap.val()[one]
                one ? callback(one) : callback(null)
            })
        },
        async api_update(ref, props, callback) {
            db.ref(ref).update(props)
            .then(() => callback())
        },
        async api_insert_storage(ref, { file, uri}, callback) {
            let file_url, uri_url = null
            storage.ref(ref+'/file.txt').put(file).then(function(snapshot1) { 
                snapshot1.ref.getDownloadURL().then(url => {
                    file_url = url
                    storage.ref(ref+'/uri.txt').put(uri).then(function(snapshot2) { 
                        snapshot2.ref.getDownloadURL().then(url => {
                            uri_url = url
                            callback(file_url, uri_url)
                        })
                    })        
                })
            })
        },
        async api_update_src_txt_file(ref, { uri, file }, callback ) {
            file = new Blob([file], {type: 'text/plain'})
            uri = new Blob([uri], {type: 'text/plain'})
                
            storage.ref(ref+'/file.txt').put(file).then(function(snapshot) {
                storage.ref(ref+'/uri.txt').put(uri).then(function(snapshot) {
                    callback()
                })        
            })
            

        }
    }
})