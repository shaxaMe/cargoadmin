<script setup>
import Dialog from "primevue/dialog";

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const visible = ref(false);

watch(()=>props.modelValue, () => {
    visible.value = props.modelValue;
})

watch(() => visible.value, (visible) => {
    emit('update:modelValue', visible);
})
</script>
<template>
  <div>
    <Dialog
      v-model:visible="visible"
      modal
      header="Edit Profile"
      :style="{ width: '50rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Update your information.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Username</label>
        <InputText id="username" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Email</label>
        <InputText id="email" class="flex-auto" autocomplete="off" />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="visible=false"
        ></Button>
        <Button type="button" label="Save" @click="visible=false"></Button>
      </div>
    </Dialog>
  </div>
</template>
<style lang="scss"></style>
