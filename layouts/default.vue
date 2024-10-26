<template>
    <div>
        <div class="flex justify-start items-start">
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
import { 
    initDropdowns} from 'flowbite'
    onMounted(() => {
    useFlowbite(() => {
        initDropdowns();
    })
})
</script>

<style lang="scss" scoped>

</style>