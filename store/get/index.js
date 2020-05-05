import { auth, db, storage } from '@/services/firebase'

export const state = () => ({
})

export const mutations = {
}
export const getters = {
}

export const actions = {
    async all({ commit }, ref) {
        try {
            await db.ref(ref).once('value')
            .then((data) =>
            {
                const obj = data.val()
                let records = []
                for(let key in obj) {
                    records.push({...obj[key], key})
                }
                console.log(records, 'my records.')
            })
            .catch((error) =>{ console.log(error) })

        } catch(err) {
            console.log("info err: ", err)
        }
    },
    
}