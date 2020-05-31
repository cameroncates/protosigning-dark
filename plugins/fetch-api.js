import Vue from 'vue'
import { auth, db, storage } from '@/services/firebase'

Vue.mixin({
    methods:{
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
    }
})