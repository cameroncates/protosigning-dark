<template>
<div class="container-fluid p-0">
    <dashboard-header @switchTab="switch_tab" />
    <dashboard-search @search="search_keywords"/>
    <dashboard-mywork  v-if="tab==0" />
    <dashboard-logomaker  v-if="tab==1" :keywords="keywords" />
    <dashboard-elements  v-if="tab==2"  />
</div>
</template>

<script>
import dashboard_header from '@/components/dashboard-header.vue'
import dashboard_search from '@/components/dashboard-search.vue'
import dashboard_mywork from '@/components/dashboard-mywork.vue'
import dashboard_logomaker from '@/components/dashboard-logomaker.vue'
import dashboard_elements from '@/components/dashboard-elements.vue'
const axios = require('axios')
const cheerio = require('cheerio')
export default {
    components: {
        "dashboard-header": dashboard_header,
        "dashboard-search": dashboard_search,
        "dashboard-mywork": dashboard_mywork,
        "dashboard-logomaker": dashboard_logomaker,
        "dashboard-elements": dashboard_elements,
    },
    data() {
        return {
            tab: 0,
            keywords: "bold"
        }
    },
    middleware() {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        let a = axios.get(proxyurl + 'https://www.brandroot.com/names?keyword=bold')
        a.then((data) => {
            console.log(data)
        })

    },
    methods: {
        search_keywords(keywords) {
            this.keywords = keywords
        },
        switch_tab(i) {
            this.tab = i
            switch (i) {
                case 0: 
                    
                    break;
            
                default:
                    break;
            }
        },
        async fetchHTML() {
        }
    },
    async mounted() {
        let $ = await this.fetchHTML()
    }
}
</script>

<style>

</style>