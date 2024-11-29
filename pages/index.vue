<template>
    <div>
    </div>
</template>

<script setup>
definePageMeta({
     middleware: 'auth' // this should match the name of the file inside the middleware directory 
});

import {useChatStore} from "~/store/chat";

const { createChat } = useChatStore();

onMounted(()=>{
    createChat()
})

</script>

<style lang="scss" scoped>

</style>