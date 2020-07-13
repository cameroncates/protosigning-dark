<template>
<div class="p-4">
    <modal :visible="show_model" @create="create_project" @cancel="show_model=false"/>
    <div class="container mt-4 bd-bottom pb-5">
        <div class="d-flex justify-content-between">
            <h5 class="font-weight-bold">Web Prototype Projects</h5>
            <button @click="show_model_func('web')" class="btn btn-primary box-shadow">Create New Project</button>
        </div>
        <div class="w-100 mt-2 mb-2"></div>
        <table class="table table-striped text-small" v-if="projects.web">
            <thead>
            <tr>
                <th>Title</th>
                <th>Created</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in projects.web" :key="i" class="hov-elem">
                <td style="min-width:200px" class="text-small">
                    <p contenteditable="true" class="mb-1 font-weight-bold">{{item.title}}</p>
                        <p class="text-sm" v-if="item.collaborators"><strong>Collaborators:</strong>
                            <span class="text-primary" v-for="(sub_item, j) in item.collaborators" :key="j">{{sub_item.uid}} . </span>
                        </p>
                    </td>
                <td class="text-primary text-sm">{{item.created}}</td>
                <td class="scale-0 hov-tg text-right">
                    <button @click="project_opt('delete_web', i)"  class="btn material-icons">delete</button>
                    <button @click="project_opt('open_web', item)" class="btn material-icons">open_in_new</button>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-else class="w-100 text-center">
            <button class="btn mt-5 font-weight-bold text-sm">
                {{loading.web ? 'Loading...' : 'No Web Projects' }}
            </button>
        </div>
    </div>

    <div class="container mt-5">
        <div class="d-flex justify-content-between bd-bottom pb-2">
            <h5 class="font-weight-bold">Other Projects</h5>
            <button @click="show_model_func('logo')" class="btn btn-primary box-shadow" data-toggle="modal" data-target="#myModal">Create New Project</button>
        </div>
        <table class="table table-striped text-small" v-if="projects.logo">
            <thead>
            <tr>
                <th>Title</th>
                <th>Created</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in projects.logo" :key="i" class="hov-elem">
                <td style="min-width:200px" class="text-small font-weight-bold" contenteditable="true">{{item.title}}</td>
                <td class="text-primary text-sm">{{item.date}}</td>
                <td class="scale-0 hov-tg text-right">
                    <button class="btn material-icons">remove_red_eye</button>
                    <button @click="project_opt('delete_logo', i)" class="btn material-icons">delete</button>
                    <button @click="project_opt('open_logo', i)" class="btn material-icons">open_in_new</button>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-else class="w-100 text-center">
            <button class="btn mt-5 font-weight-bold text-sm">
                {{loading.logo ? 'Loading...' : 'No Logo Projects' }}
            </button>
        </div>
    </div>
    <button v-if="loading.$" class="btn btn-primary p-2 pl-3 pr-3 animated fadeInUp faster p-absolute z-1300 text-white bd-round box-shadow transition-3" style="left:25px; bottom:25px">
        <span class="spinner-border spinner-border-sm"></span>
        <span class="text-small ml-2">{{loading.msg}}</span>
    </button>

</div>
</template>

<script>
import modal from '@/components/widgets/prompt.vue'
export default {
    components: {
        modal
    },
    data() {
        return {
            uid: null,
            loading: {
                web: true,
                logo: true,
                $: false,
                msg: ""
            },
            projects: {
                web: null,
                logo: null,
                type: null
            },
            show_model: false
        }
    },
    methods: {
        show_model_func(type) {
            this.projects.type = type; 
            this.show_model=true; 
            window.scrollTo(0, 0);            
        },
        create_project(title) {
            this.loading.$ = true
            this.loading.msg = "Creating Project..."
            this.show_model = false
            switch(this.projects.type) {
                case 'logo':
                    let ref = 'projects/'+this.uid,
                    metadata = {
                        date: $datetime(),
                        title,
                        data: null,
                        collaborators: []
                    }
                    this.api_insert(ref, metadata, (key) => {
                        let file = new Blob([''], {type: 'text/plain'}),
                            uri = new Blob([''], {type: 'text/plain'})
                        this.api_insert_storage(ref+'/'+key, { file, uri }, (file_url, uri_url) => {
                            this.api_update(ref+'/'+key, {'file_url': file_url, 'uri_url': uri_url}, () => {
                                this.$router.push('/editor/svg/'+key)
                            })
                        })                    
                    })
                    break
                case 'web':
                    let obj = {
                        title,
                        owner: this.uid,
                        collaborators: [],
                        created: $datetime(),
                        pages: [{ title: "Blank" }],
                    }
                    this.api_insert('projects/web/'+this.uid, obj, (project_key) => {
                        this.api_fetch_child_ref('users/'+this.uid, (key) => {
                            this.api_update('users/'+this.uid+'/'+key, { projects: [...this.project_keys, project_key] })
                            this.loading.$ = false
                        })
                    })
                    break
            }
        },
        init_create_project(type) {
        },
        project_opt(opt, project) {
            let ref = null
            switch (opt) {
                case 'open_web':
                    var port = prompt("Please enter port number", "5050");
                    if(port) {
                        window.open('http://localhost:'+port+'/workspace/web/prj-t='+project.title+"&prj-id="+project.key, '_blank')
                    }
                    break;
                case 'open_logo':
                    this.$router.push('/editor/svg/'+project)
                    break
                case 'delete_logo':
                    ref = 'projects/'+this.uid+'/'+project
                    this.firebase_remove(ref, payload => {
                        console.log(payload, 'payload')
                    })
                    break
                case 'delete_web':
                    ref = 'projects/web/'+this.uid+'/'+project
                    this.firebase_remove(ref, payload => {
                        console.log(payload, 'payload')
                    })
                    break
                default:
                    break;
            }
        }
    },
    mounted() {
        this.uid = this.$store.state.user.uid
        this.loading.logo = this.loading.web = true
        this.api_fetch('projects/'+this.uid, (payload) => {
            if(payload) {
                this.projects.logo = payload
            } else {
                this.loading.logo = false
            }
        }) 
        this.api_fetch('projects/web/'+this.uid, (payload) => {
            if(payload) {
                this.projects.web = payload
                for(let key in this.projects.web) {
                    this.projects.web[key] = { ...this.projects.web[key], key }
                    if(this.projects.web[key].collaborators) {
                        let project_collaborators = this.projects.web[key].collaborators
                        for(let nested_key in project_collaborators) {
                            let uid = project_collaborators[nested_key].uid
                            this.api_fetch('users/'+uid, (payload) => {
                                if(payload) {
                                    this.projects.web[key].collaborators[nested_key].uid = Object.values(payload)[0].email
                                }
                            })
                        }
                    }
                }
            } 
            else {
                this.loading.web = false
            }

        })
    }
}
</script>

<style>

</style>