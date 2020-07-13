
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href:"https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css", rel: "stylesheet"},
      { href:"https://unpkg.com/aos@next/dist/aos.css", rel: "stylesheet"},
      { href:"https://fonts.googleapis.com/icon?family=Material+Icons", rel: "stylesheet"},
    ],
    script: [
      { src: "/pngtosvg/jquery-3.3.1.min.js"},
      { src: "/pngtosvg/raphael-2.1.0.js"},
      { src: "/pngtosvg/popper.min.js"},
      { src: "/pngtosvg/color-thief.js"},
      { src: "/pngtosvg/all_5_4.js"},
      { src: "/pngtosvg/appfree.js"},
      { src: "/pngtosvg/CanvasEffects.worker.js"},
      { src: "/pngtosvg/worker.js"},
      { src: "/pngtosvg/Blob.js"},
      { src: "/js/include.js"},
      { src: "/js/dip/FILTER.js"},
      { src: "/js/dip/IMG_FUNCTIONS.js"},
      { src: "/js/dip/EDGE_DETECTOR.js"},
      { src:"https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.6/ace.js"},
      { src: "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"},
      { src: "https://unpkg.com/aos@next/dist/aos.js"},
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '~assets/css/bootstrap-ext.css',
    '~assets/css/animate-css.css',
    '~assets/icon/style.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/fetch-api.js', '~/plugins/user-api.js'],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  router: {
    middleware: ["authenticated"]
  },
  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api/index.js'
    }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
