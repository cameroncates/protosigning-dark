<template>
    <div class="p-absolute border animated fadeInUp faster" ref="parent-container" id="parent-container">
        <!-- CLOSE BTN -->
        <div class="row m-0 mb-4 justify-content-center" ref="close-btn-container">
            <button @click="$close()" class="btn font-weight-bold bd-round material-icons">expand_more</button>
        </div>
        <!-- CLOSE BTN -->
        
        <div class="row m-0" :style="{height: height.container + 'px'}">
            <div class="p-3 border-rights align-self-center" style="width:300px">
                <button @click="tab = $switch_tab(i)" v-for="(item, i) in tabs" :key="i+0.1" :class="tab==i ? class_.tab : ''" class="btn btn-block p-3 text-left bd-round-r d-flex">
                    <span class="material-icons ml-2 mr-3">{{item.icon}}</span><span>{{item.title}}</span>
                </button>
            </div>


            <div class="p-3 overflow-auto" :style="{width: width.content_area+ 'px', height: height.container + 'px'}">
                <!-- SEARCH -->
                <div class="w-100 text-center input-group mb-4">
                    <input type="text" :class="keywords.length <= 0 ? 'bd-round-r' : ''" class="bd-round-l form-control bg-dark p-3 pl-4 bd-0 text-white ls-1 h-100" style="min-width:200px" placeholder="Search for Prototypes" v-model="keywords">
                    <div class="input-group-prepend">
                        <button @click="keywords=''" class="btn btn-dark  material-icons bd-round-r text-white">
                            <span v-if="keywords.length > 0" class="animated fadeIn faster">clear</span>
                            <span v-else class="animated fadeInUp faster">search</span>
                        </button>
                        <button v-for="(item, i) in (selected.search_by)" :key="i" class="btn btn-dark ml-2 bd-round d-flex pl-3 pr-3 animated fadeInRight faster">
                            <span class="align-self-center mr-3">{{item.title}}</span> 
                            <span class="align-self-center material-icons">arrow_drop_down</span>
                        </button>
                        <button class="btn btn-dark ml-2 bd-round d-flex pl-3 pr-3 animated fadeInRight faster" v-if="tab==1">
                            <span class="align-self-center mr-3">Color</span> <span class="align-self-center round-md"></span>
                        </button>
                    </div>
                </div>
                <!-- SEARCH -->
                <!-- SEARCH TAGS -->
                <div class="row m-0">
                    <button v-for="(item, i) in serach_tags" :key="i+0.2" class="btn btn-dark-special pl-3 mr-2 pr-1 bd-round d-flex" @click="$remove_keyword($event)">
                        <span class="mr-2 align-self-center">{{item.title}}</span>
                        <span class="material-icons">cancel</span>
                    </button>
                </div>
                <!-- SEARCH TAGS -->

                <div v-for="(obj, key) in (selected.content)" :key="key" class="">
                    <div class="mt-5 row">
                        <h4 class="p-1 mr-2 text-white">{{key.charAt(0).toUpperCase() + key.slice(1)}}</h4>
                        <span v-if="obj.length <=1" class="spinner-border text-success spinner-border-sm align-self-center"></span>
                    </div>
                    <div class="p-relative" v-if="obj.length > 0">
                        <button @click="$scrollRight($event)" class="btn material-icons horizontal-scroll-btn  p-absolute">chevron_left</button>
                        <button @click="$scrollLeft($event)" class="btn material-icons horizontal-scroll-btn p-absolute" style="right:0px;">chevron_right</button>
                        <div class="d-flex overflow-hidden scroll-content ml-4 mr-4">
                            <!-- WHOLE CARD -->
                            <div v-for="(item, k) in obj" :key="k" class="m-4 hover-effect-1" :class="k==0 && item.title == 'Blank' ? 'align-self-center' : 'align-self-end'">
                                <!-- IMAGE CARD -->
                                <div class="p-relative d-flex border overflow-hidden bd-radius-12" :class="k!=0 && item.title != 'Blank' ? 'preview-box bg-dark' : '' " :style="{width: 300+'px', minHeight: 250+'px'}">
                                    <!-- BLANK PROJECT CARD -->
                                    <div class="text-center p-2 align-self-center col-md-12" v-if="item.title == 'Blank'">
                                        <div class="w-100">
                                            <button @click="$open('blank', 1)" class="btn horizontal-scroll-btn material-icons">add</button>
                                        </div>
                                        <p class="small mt-3">Blank {{key.charAt(0).toUpperCase() + key.slice(1) }}</p>
                                    </div>
                                    <!-- BLANK PROJECT CARD -->
                                    <!-- DARK-OVERLAY -->
                                    <div class="p-0 w-100 p-absolute h-100 text-right hover-effect-1-overlay d-none">
                                        <button class="btn text-white material-icons opacity-0 m-2 p-0">more_vert</button>
                                    </div>
                                    <!-- DARK-OVERLAY -->
                                    <img @load="$img_loaded($event)" :src="item.img_url" alt="" width="100%" class="v-hidden">
                                </div>
                                <!-- IMAGE CARD -->
                                <p class="font-weight-bold text-white m-0 mt-2 ml-2 ls-1" v-if="item.title != 'Blank'">{{item.title}}</p>
                                <!-- <p class="m-0 ml-2 ls-1 small">Created 12th May 1998</p> -->
                            </div>
                            <!-- WHOLE CARD -->
                        </div>
                    </div>
                    <div v-else class="w-100 text-center">
                        <button class="btn btn-dark"></button>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<script>
import {EventBus} from '@/globals/event-bus.js'

import tools from '@/assets/svg/tools.svg'
import web from '@/assets/svg/web.svg'
import responsive_design from '@/assets/svg/responsive-design.svg'
import list from '@/assets/svg/list.svg'
import computer from '@/assets/svg/computer.svg'
import business from '@/assets/svg/business.svg'
import new_file from "@/assets/svg/new-file.svg"
export default {
    props: {
        e: {
            required: false
        }
    },
    data() {
        return {
            tab: 2,
            keywords: "",
            tabs: [
                { icon: "home", title: "Prototypes"},
                { icon: "ac_unit", title: "Logos"},
                { icon: "home", title: "Design & Art"},
            ],
            class_: {
                tab: 'font-weight-bold text-success animated fadeIn'
            },
            selected: {
                search_by: null,
                content: null
            },
            search_by: {
                logo: [
                    { title: "Category"},
                    { title: "Personality"},
                    { title: "Name Sets"},
                ],
                designs: [                    
                    { title: "Category"},
                ],
                prototypes: [                    
                    { title: "Category"},
                ]
            },
            serach_tags: [
                { title: "Birthday", },
                { title: "design", },
                { title: "art", },
            ],
            parent_container: null,           
            height: {
                container: 500
            },
            width: {
                content_area: 200
            },
            designs: {
                poster: [
                    { title: "Blank", img_url: null}
                ],
                facebookPost: []
            },
            prototypes: {},
            logos: {}
        }
    },
    methods: {
        $open(id, workspace) {
            // 0 => PROTOTYPING WORKSPACE
            // 1 => SVG WORKSPACE
            let url = null
            this.$close()
            switch(workspace) {
                case 0:
                    break
                case 1:
                    url = '/editor/svg/'+id
                    this.$emit('$goto', url)
                    break
            }
        },
        $switch_tab(tab) {
            switch(tab) {
                case 0:
                    this.selected.search_by = this.search_by.prototypes
                    this.selected.content = this.prototypes
                    break
                case 1:
                    this.selected.search_by = this.search_by.logo
                    this.selected.content = this.logos
                    break
                case 2:
                    this.selected.search_by = this.search_by.designs
                    this.selected.content = this.designs
                    break
            }
            return tab
        },
        $scrollLeft(e) {
            let content = $(e.target).next(),
                width = content.outerWidth(),
                currentScrollPos = content.scrollLeft()
            content.animate({
                scrollLeft: currentScrollPos + width/2
            }, 600)
        },
        $scrollRight(e) {
            let content = $(e.target).next().next(),
                width = content.outerWidth(),
                currentScrollPos = content.scrollLeft()
            content.animate({
                scrollLeft: currentScrollPos - width/2
            }, 600)
        },
        $close() {
            this.parent_container.addClass("animated fadeOutDown faster")
            setTimeout(() => {
                this.parent_container.remove()            
            }, 500);
        },
        $def_w_h() {
            let close_btn = $(this.$refs['close-btn-container'])
            this.height.container = $get_window_based_height(close_btn) - 70
            this.width.content_area = $(window).width() - 300 - 40
        },
        $remove_keyword(e) {
            e = $(e.target)
            e.is("button") ? e.remove() : e.parent().remove()
        },
        $img_loaded(e) {
            e = $(e.target)
            let preview_box = e.parent(),
                previous = e.prev()
            preview_box.css({
                minHeight: e.height() + 'px',
            })
            setTimeout(() => {
                e.removeClass("v-hidden").addClass("animated fadeIn")
                previous.removeClass("d-none")
                preview_box.removeClass("preview-box")                
            }, 500);
        },
    },
    mounted() {
        this.$def_w_h()
        this.$switch_tab(this.tab)
        this.parent_container = $(this.$refs['parent-container'])
        this.$refs['parent-container'].addEventListener("animationend", () => this.parent_container.removeClass("animated fadeInUp faster"))
        $(window).resize(() => this.$def_w_h())
        
        this.$api_fetch('designs/poster', (results) => {
            this.designs.poster = this.designs.poster.concat(results)
        })
        this.$api_fetch("designs/facebookPost", (results) => this.designs.facebookPost = results)
    }
}
</script>

<style>
#parent-container {
    top: 25px;
    left: 15px;
    right: 15px;
    bottom: 0px;
    background: #0D0D0D;
    z-index: 1000;
    border-radius: 10px 10px 0px 0px;
}
.hover-effect-1:hover img {
    transition: 0.5s;
    transform: scale(1.1);
    filter: blur(2px);
}
.hover-effect-1:hover .hover-effect-1-overlay {
    transition: 0.5s;
    z-index: 100;
    background-color: rgba(0,0,0,0.75) !important;
}
.hover-effect-1:hover button {
    opacity: 1;
}
.horizontal-scroll-btn {
    background: #111111 !important;
    color: white !important;
    z-index: 1000;
    top: calc(50% - 30px);
    width:60px;
    height:60px;
    border-radius: 50%;
    /* position: absolute; */
}
</style>