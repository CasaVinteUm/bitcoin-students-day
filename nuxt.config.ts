export default defineNuxtConfig({
    // extends: ['docus'],
    modules: [
        // '@nuxtjs/plausible',
        // '@nuxtjs/i18n'
    ],
    css: ['~/assets/css/main.css'],
    site: {
        name: 'Bitcoin Students Day',
    },
    vite: {
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
            ],
        },
    },
    compatibilityDate: '2025-07-18',
    // i18n: {
    //     defaultLocale: 'en',
    //     locales: [{
    //         code: 'en',
    //         name: 'English',
    //     }, {
    //         code: 'fr',
    //         name: 'Français',
    //     }],
    // },
    // llms: {
    //     domain: 'https://docus.dev',
    //     title: 'Docus',
    //     description: 'Write beautiful docs with Markdown.',
    //     full: {
    //         title: 'Docus',
    //         description: 'Write beautiful docs with Markdown.',
    //     },
    // },
})
