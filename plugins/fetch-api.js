import Vue from 'vue'
import { auth, db, storage } from '@/services/firebase'

Vue.mixin({
    methods:{
        async $api_fetch(ref, callback){
            await db.ref(ref).once('value')
            .then((data) =>
            {
                const obj = data.val()
                let records = []
                for(let key in obj) {
                    records.push({...obj[key], key})
                }
                callback(records)
            })
            .catch((error) =>{ console.log(error) })
    },
    }
})