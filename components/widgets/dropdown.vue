<template>
    <div :style="{width: w + 'px'}">
        <p class="text-sm pb-1 m-0">{{title}}</p>
        <button class="btn no-btn bg-light-2 pt-1 pb-1 pr-1 w-100 d-flex justify-content-between align-items-center">
            <span class="small">{{selected}}</span>
            <span class="btn p-0 material-icons">arrow_drop_down</span>
        </button>
    </div>
  
</template>

<script>
export default {
    props: {
        title: {
            required: true
        },
        w: {
            required: false
        },
        selected: {
            required: false
        }
    },
}
</script>

<style>

</style>