import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Chrome from './pages/chrome'
import { buildStore } from './store'
import Debug from 'debug'
import './support/offline'

const debug = Debug('app:app')

/**
 * The main application. Exposed like this for testing.
 *
 *     app = new App()
 *     app.start()
 *     app.stop()
 */

export default class App {
  /**
   * Starts the application.
   */

  start () {
    debug(`Starting Flowloop ${process.env.VERSION}`)

    const store = this.store = buildStore()

    store.dispatch({ type: 'init' })
    store.dispatch({ type: 'persistence:load!' })
    store.dispatch({ type: 'icon:reset!' })

    // Start with the home page even if we're not loading the home page.
    // Kind of a hax if riot-route takes too long to spin up
    store.dispatch({ type: 'route:change', page: 'HomeIndex' })

    const div = this.div = document.createElement('div')
    div.id = 'root'
    div.className = 'app-root'
    document.body.appendChild(div)

    this.removeLoadingScreen()

    debug('ReactDOM.render()')
    ReactDOM.render(
      <Provider store={store}>
        <Chrome />
      </Provider>
      , div)

    return this
  }

  /*
   * Removes the loading screen that's shown before JavaScript.
   */

  removeLoadingScreen () {
    const $screen = document.getElementById('loading-screen')
    if ($screen) $screen.parentNode.removeChild($screen)
  }

  /**
   * Stop everything; unmounts React nodes and stops the store.
   */

  stop () {
    this.store.dispatch({ type: 'stop!' })
    ReactDOM.render(<noscript />, this.div)
    this.div.parentNode.removeChild(this.div)
    return this
  }
}

/*
 * Performance
 */

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf')
}

/*
 * Auto-start
 */

/* istanbul ignore if */
if (!module.parent) {
  window.__APP__ = (new App({
    env: process.env.NODE_ENV || 'development'
  })).start()
}
