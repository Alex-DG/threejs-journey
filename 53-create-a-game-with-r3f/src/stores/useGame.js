import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(
  subscribeWithSelector((set) => {
    return {
      blocksCount: 3,
      //   blocksCount: 10,
      blocksSeed: 0,

      /**
       * Time
       */
      startTime: 0,
      endTime: 0,

      /**
       * Phases
       */
      phase: 'ready',

      start: () => {
        set((state) => {
          if (state.phase === 'ready') {
            console.log('-- PLAYING --')
            return { phase: 'playing', startTime: Date.now() }
          }

          return {}
        })
      },

      restart: () => {
        set((state) => {
          if (state.phase === 'playing' || state.phase === 'ended') {
            console.log('-- READY --')
            return { phase: 'ready', blocksSeed: Math.random() }
          }

          return {}
        })
      },

      end: () => {
        set((state) => {
          if (state.phase === 'playing') {
            console.log('-- ENDED --')
            return { phase: 'ended', endTime: Date.now() }
          }

          return {}
        })
      },
    }
  })
)
