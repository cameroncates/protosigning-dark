<template>
    <div class="p-absolute border animated fadeInUp faster" ref="parent-container" id="parent-container">
        <!-- CLOSE BTN -->
        <div class="row m-0 mb-4 justify-content-center" ref="close-btn-container">
            <button @click="$close()" class="btn font-weight-bold bd-round material-icons">expand_more</button>
        </div>
        <!-- CLOSE BTN -->
        
        <div class="row m-0" :style="{height: height.container + 'px'}">
            <div class="p-3 border-rights align-self-center" style="width:300px">
                <button class="btn btn-block p-3 text-left bd-round-r d-flex"><span class="material-icons ml-2 mr-3">home</span><span>Web Prototypes</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex"><span class="material-icons ml-2 mr-3">ac_unit</span><span>Company Logo</span></button>
                <button class="btn btn-block p-3 text-left bd-round-r d-flex text-success font-weight-bold"><span class="material-icons ml-2 mr-3">home</span><span>Design & Art</span></button>
            </div>
            <div class="p-3 overflow-auto" :style="{width: width.content_area+ 'px', height: height.container + 'px'}">
                <!-- SEARCH -->
                <div class="w-100 text-center input-group mb-4">
                    <div class="input-group-prepend">
                        <button class="btn material-icons bd-round-l bg-dark ">search</button>
                    </div>
                    <input type="text" class="form-control bg-dark p-4 bd-0 text-white" placeholder="Search for Prototypes">
                    <div class="input-group-prepend">
                        <button class="btn material-icons bd-round-r bg-dark">clear</button>
                        <button class="btn ml-2 bd-round bg-dark d-flex pl-3 pr-3"><span class="align-self-center mr-2">Category</span> <span class="material-icons">arrow_drop_down</span></button>
                    </div>
                </div>
                <!-- SEARCH -->
                <!-- SEARCH TAGS -->
                <div class="row m-0">
                    <button @click="$remove_keyword($event)" class="btn btn-dark-special pl-3 mr-2 pr-1 bd-round d-flex"><span class="mr-2 align-self-center">Birthday</span> <span class="material-icons">cancel</span></button>
                    <button @click="$remove_keyword($event)" class="btn btn-dark-special pl-3 mr-2 pr-1 bd-round d-flex"><span class="mr-2 align-self-center">Poster</span> <span class="material-icons">cancel</span></button>
                    <button @click="$remove_keyword($event)" class="btn btn-dark-special pl-3 mr-2 pr-1 bd-round d-flex"><span class="mr-2 align-self-center">Design</span> <span class="material-icons">cancel</span></button>
                </div>
                <!-- SEARCH TAGS -->

                <div v-for="(obj, key) in designs" :key="key" class="">
                    <div class="mt-5 row">
                        <h4 class="p-1 mr-2 text-white">{{key.charAt(0).toUpperCase() + key.slice(1)}}</h4>
                        <span v-if="obj.length <=0" class="spinner-border text-success spinner-border-sm align-self-center"></span>
                    </div>
                    <div class="p-relative" v-if="obj.length > 0">
                        <button @click="$scrollRight($event)" class="btn material-icons horizontal-scroll-btn">chevron_left</button>
                        <button @click="$scrollLeft($event)" class="btn material-icons horizontal-scroll-btn" style="right:0px;">chevron_right</button>
                        <div class="d-flex overflow-hidden scroll-content ml-4 mr-4">
                            <div v-for="(item, k) in obj" :key="k" class="m-4 align-self-center hover-effect-1">
                                <div class="p-relative overflow-hidden bd-radius-12 bg-dark preview-box" :style="{width: 300+'px', minHeight: 250+'px'}">
                                    <div class="p-0 w-100 p-absolute h-100 text-right hover-effect-1-overlay d-none">
                                        <button class="btn text-white material-icons opacity-0 m-2 p-0">more_vert</button>
                                    </div>
                                    <img @load="$img_loaded($event)" :src="item.img_url" alt="" width="100%" class="v-hidden">
                                </div>
                                <p class="font-weight-bold text-white m-0 mt-2 ml-2 ls-1">{{item.title}}</p>
                                <p class="m-0 ml-2 ls-1 small">Created 12th May 1998</p>
                            </div>
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

import tools from '@/assets/svg/tools.svg'
import web from '@/assets/svg/web.svg'
import responsive_design from '@/assets/svg/responsive-design.svg'
import list from '@/assets/svg/list.svg'
import computer from '@/assets/svg/computer.svg'
import business from '@/assets/svg/business.svg'
export default {
    props: {
        e: {
            required: false
        }
    },
    data() {
        return {
            parent_container: null,           
            height: {
                container: 500
            },
            width: {
                content_area: 200
            },
            designs: {
                poster: [],
                facebookPost: []
            }
        }
    },
    methods: {
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
        this.parent_container = $(this.$refs['parent-container'])
        this.$refs['parent-container'].addEventListener("animationend", () => this.parent_container.removeClass("animated fadeInUp faster"))
        $(window).resize(() => this.$def_w_h())
        
        this.$api_fetch('designs/poster', (results) => {
            this.designs.poster = results
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
    background: #212020 !important;
    color: white !important;
    z-index: 1000;
    top: calc(50% - 30px);
    width:60px;
    height:60px;
    border-radius: 50%;
    position: absolute;
}
</style>