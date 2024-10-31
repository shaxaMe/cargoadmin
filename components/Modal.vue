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
      header="Transport qo’shish"
      :style="{ width: '70dvw' }"
    >
     <slot></slot>
      <div class="flex justify-end gap-2 mt-10">
        <Button
          type="button"
          label="Bekor qilish"
          severity="secondary"
          @click="visible=false"
        ></Button>
        <Button type="button" label="Saqlash" @click="visible=false"></Button>
      </div>
    </Dialog>
  </div>
</template>
<style lang="scss"></style>
