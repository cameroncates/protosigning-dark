<template>
<div ref="root" class="p-absolute bg-white animated fadeInLeft faster overflow-auto pl-2 pr-2 pb-5" style="z-index:1200" :style="{width: root['w'] + 'px', height: root['h'] + 'px'}">
    <div class="input-group p-2 bd-bottom">
        <div class="input-group-prepend">
            <button @click="$hide()" class="btn input-group-text material-icons p-0 bg-white bd-0">chevron_left</button>
        </div>
        <input type="text" class="form-control bd-0" placeholder="Search...">
        <div class="input-group-append">
            <button class="btn input-group-text material-icons p-0 bg-white bd-0">tune</button>
            <button class="btn input-group-text material-icons p-0 bg-white bd-0 ml-3">more_vert</button>
        </div>
    </div>
    
    <div ref="tools" class="bd-bottom w-100 p-2 mt-2" v-for="(obj, key) in data[active]" :key="key" :class="obj['data'].length == 0 ? 'd-none': ''">
        <button class="btn no-btn p-0 mt-2 mb-1">
            <span>{{obj['title']}} &#149;</span><span class="text-sm font-weight-bold mr-2 text-primary"> {{obj['data'].length}} Items</span>
            <!-- <span class="material-icons btn p-0 text-md transition-3">chevron_right</span> -->
        </button>
        <div class="d-flex flex-wrap justify-content-center">
            <div @click="$select(nested)" class="hov-bd-blue p-3 m-2 bg-light-2" v-for="(nested, i, j) in obj['data'].slice(0, obj.slice)" :key="j" :class="nested['key'] == select ? 'border-blue' : ''">
                <img :src="nested['img_url']" width="28" alt="" @load="$loaded($event)">
            </div>
            <button v-if="data[active][key]['data'].length > data[active][key]['slice']" @click="data[active][key]['slice'] += 24" class="btn btn-block font-weight-bold p-0 material-icons text-md">expand_more</button>
        </div>
    </div>


</div>
</template>

<script>
import JSON_editor from '@/assets/json/editor.json'
export default {
    props: {
        w: {
            required: true
        }
    },
    data() {
        return {
            root: { node: null, w: 0, h: 0, },
            tools: { node: null },
            active: "elements",
            select: null,
            data: {
                elements: {
                    basic: { title: "Basic", data: [], slice: 8 },
                    graphical: { title: "Graphical", data: [], slice: 8 },
                    socialMedia: { title: "Social Media", data: [], slice: 8 },
                    food: { title: "Food", data: [], slice:8 },
                    objects: { title: "Objects", data: [], slice: 8 },
                    symbols: { title: "Symbols", data: [], slice: 8 },
                    pieChart: { title: "Pie Chart",data: [], slice: 8 },
                    arrows: { title: "Arrows", data: [], slice: 8 },
                    flowchart: { title: "Flowchart", data: [], slice: 8 },
                    animals: { title: "Animals", data: [], slice: 8 },
                    cardsAndChess: { title: "Cards & Chess", data: [], slice: 8 },
                    dialogBallons: { title: "Dialog Ballons", data: [], slice: 8 },
                    electronics: { title: "Electronics", data: [], slice: 8 },
                    mathematical: { title: "Mathematical", data: [], slice: 8 },
                    music: { title: "Music", data: [], slice: 8 },
                    miscellaneous: { title: "Miscellaneous", data: [], slice: 8 },
                },
                templates: {},
                text: {},
                backgrounds: {},
                photos: {}
            }
        }
    },
    methods: {
        $hide() {
            this.root.node.addClass("fadeOutLeft")
            setTimeout(() => {
                this.root.node.remove()
            }, 500);
        },
        $loaded(e) {
            e = $(e.target)
            e.addClass("animated zoomIn faster").parent().removeClass("bg-light-2")
        },
        $select(elem) {
            this.select = elem['key']
            this.$emit("$select", {...elem, type: this.active } )            
        },
        $fetch(active = this.active) {
            this.$api_fetch(active, (item, title) => this.data[this.active][title]["data"] = item)
        },
        $init() {
            this.root.node = $(this.$refs['root'])
            this.tools.node = $(this.$refs['tools'])
            this.$fetch()
            this.$w_h()
        },
        $w_h() {
            this.root['h'] = $(window).height()
            this.root['w'] = this.w
        },

    },
    mounted() {
        this.$init()
        $(window).resize(() => this.$w_h())
    }

}
</script>

<style>
.border-blue {    
    border: 2px solid rgb(0, 123, 255);
}
.hov-bd-blue {
    border: 2px solid transparent;
    transition: 0.3s;
}
.hov-bd-blue:hover {
    border: 2px solid rgb(0, 123, 255);
}
</style>