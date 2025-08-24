<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { descriptors } from './descriptors'

const state = reactive({
  email: ''
})

const descriptor = ref('')

const isDescriptorEmpty = computed(() => descriptor.value === '')

async function onSubmit() {
  if (!state.email) {
    return;
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(state.email))
  // Get last 16 bytes of the digest
  // then, convert to number and mod by list length
  const descriptorList = descriptors

  const last16Bytes = new Uint8Array(digest.slice(-16))
  const index = Array.from(last16Bytes).reduce((acc, byte) => acc + byte, 0) % descriptorList.length
  descriptor.value = descriptorList[index]
}
</script>

<template>
  <div v-if="isDescriptorEmpty" class="flex justify-center">
    <div class="w-1/2">
      <UForm class="space-y-4" :state="state" @submit="onSubmit">
        <UFormField label="Email">
          <UInput placeholder="Digite seu e-mail aqui" class="w-full" v-model="state.email"/>
        </UFormField>
        <UButton type="submit">
          Ok
        </UButton>
      </UForm>
    </div>
  </div>
  <ProsePre v-else>
    <code>
      {{ descriptor }}
    </code>
  </ProsePre>
</template>

<style scoped>

</style>
