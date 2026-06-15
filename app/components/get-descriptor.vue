<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

const state = reactive({
  email: ''
})

const descriptor = ref('')
const error = ref('')
const loading = ref(false)

const isDescriptorEmpty = computed(() => descriptor.value === '')

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
}

async function onSubmit() {
  if (!state.email || loading.value) {
    return
  }
  error.value = ''
  loading.value = true
  try {
    // Hash client-side so the raw e-mail never leaves the browser.
    const emailHash = await sha256Hex(state.email.trim().toLowerCase())
    const { descriptor: claimed } = await $fetch<{ descriptor: string }>('/api/descriptor', {
      method: 'POST',
      body: { emailHash }
    })
    descriptor.value = claimed
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.statusMessage || 'Algo deu errado. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="isDescriptorEmpty" class="flex justify-center">
    <div class="w-1/2">
      <UForm class="space-y-4" :state="state" @submit="onSubmit">
        <UFormField label="Email" description="Digite seu e-mail para ver o seu descriptor que será usado no workshop:">
          <UInput placeholder="Digite seu e-mail aqui" class="w-full" v-model="state.email"/>
        </UFormField>
        <UButton type="submit" :loading="loading">
          Ok
        </UButton>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
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
