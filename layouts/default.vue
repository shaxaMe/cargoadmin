<template>
    <div>
        <div class="flex justify-start items-stretch">
            <Aside></Aside>
            <div class="flex-1">
                <Navbar />
                <NuxtPage  />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useFlowbite } from '~/composables/useFlowbite';
import {useChatStore} from "~/store/chat";
import { 
    initDropdowns} from 'flowbite'
    const { createChat } = useChatStore();
    onMounted(() => {
    useFlowbite(() => {
        initDropdowns();
    });
    createChat()
})
</script>

<style lang="scss" scoped>

</style>