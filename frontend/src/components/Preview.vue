<template>
    <div v-html="htmlData" class="page-content"></div>
</template>

<script>
export default {
    props: {
        htmlData: {
            type: String,
            required: true
        }
    }
}
</script>


<style scoped>
.page-content {
    font-family: Arial, sans-serif;
    margin: 0 auto;
    max-width: 800px;
    padding: 20px;
}
</style>