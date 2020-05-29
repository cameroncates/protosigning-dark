<template>
    <div class="row p-0 m-0" :style="{height: heights.window + 'px'}">
        <div class="overflow-auto pb-5" :style="{height: heights.window + 'px', width: widths.left_nav + 'px'}">
            <!-- PROFILE INFO -->
            <div class="d-flex justify-content-between p-2 m-3">
                <div class="row m-0">
                    <img :src="svg.computer" width="30px" alt="" class="m-1">
                    <div>
                        <button class="btn align-self-center">
                            <span v-if="user_info.uname">{{user_info.uname}}</span>
                            <span v-else class="spinner-border spinner-border-sm"></span>
                        </button>
                    </div>
                </div>
                <div>
                    <button class="btn material-icons bd-round">keyboard_arrow_down</button>
                </div>
            </div>
            <!-- PROFILE INFO -->

            <!-- MENU BUTTONS -->
            <div class="">
                <button @click="$new()" class="btn btn-block p-3 text-left bd-round-r d-flex font-weight-bold"><span class="material-icons ml-2 mr-3">add</span><span>New</span></button>
                <p class="bd-bottom ml-2 mr-2 mt-2"></p>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex"><span class="material-icons ml-2 mr-3">home</span><span>Home</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r btn-primary box-shadow d-flex font-weight-bold "><span class="material-icons ml-2 mr-3">view_quilt</span><span>Templates</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex "><span class="material-icons ml-2 mr-3">style</span><span>All your Designs</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex "><span class="material-icons ml-2 mr-3">photo</span><span>Photos</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex "><span class="material-icons ml-2 mr-3">group</span><span>Share with me</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex "><span class="material-icons ml-2 mr-3">favorite</span><span>Favourite</span></button>
            </div>
            <!-- MENU BUTTONS -->
        </div>
        <div class="pl-4" :style="{width: widths.content_area + 'px'}">
            <!-- SEARCH CONTAINER -->
            <div class="bg-white box-shadow m-0 row" :style="{height: heights.search_container + 'px'}">
                <div class="col-md-6 m-auto align-self-center text-center">
                    <h4 class="ls-2 col-md-12">Search your whole dashboard here</h4>
                    <p class="col-md-12 ls-1 small">You can search for templates, designs and your projects here.</p>
                    <div class="w-100 text-center input-group mt-4 bd-round bg-light box-shadow">
                        <input type="text" class="form-control p-4 bd-0 bg-light bd-round-l" placeholder="Search for templates or designs or logos">
                        <div class="input-group-prepend">
                            <button class="btn material-icons bd-round-r">search</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- SEARCH CONTAINER -->

        </div>
    </div>
</template>

<script>
import computer from '@/assets/svg/computer.svg'
import vue from 'vue'
import { EventBus } from '@/globals/event-bus.js'

// IMPORT COMPONENTS
import createNew_component from '@/components/dashboard-createNew-popup.vue'

export default {
    components: {
        createNew_component
    },
    data() {
        return {
            uid: null,
            svg: {
                computer: computer
            },
            heights: {
                window: 100,
                search_container: 200
            },
            widths: {
                left_nav: 300,
                content_area: 500
            },
            user_info: {
                uname: null,
                email: null,
                password: null
            }
        }
    },
    methods: {
        get_File() {            
            this.$store.dispatch("user/get_test")
        },
        $new() {            
            let { html, instance } = this.$component(createNew_component)
            $(document.body).prepend(html)
            instance.$on('$goto', (url) => {
                this.$router.push(url)
            })
        },
        $init() {
            let $this = this
            this.$def_w_h()
            this.uid = this.$store.state.user.uid
            let get_info = this.$store.dispatch("user/info", this.uid)
            get_info.then(() => {
                this.user_info = this.$store.state.user.info
            })
        },
        $def_w_h() {
            this.heights.window = $(window).height()
            this.heights.search_container = $(window).height()/2.5
            this.widths.content_area = $(window).width() - this.widths.left_nav
        },
        $component(component, props = null) {
            let ComponentClass = vue.extend(component)
            let instance = new ComponentClass({ propsData: props })
            instance.$mount()
            return {
                html: instance.$el,
                instance
            }
        },
    },
    mounted() {
        this.$init()
        $(window).resize(() => this.$def_w_h())
    }

}
</script>

<style>
body {
    overflow: hidden;
}
</style>