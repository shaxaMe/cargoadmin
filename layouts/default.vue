<template>
    <div>
        <div class="flex justify-start items-stretch h-full min-h-[100dvh]">
            <Aside></Aside>
            <div class="flex-1 h-auto min-h-full overflow-hidden">
                <Navbar />
                <NuxtPage />
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
    });
})
</script>

<style lang="scss" scoped>

</style>