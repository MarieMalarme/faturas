import { atomizify, flagify } from 'atomizify'

atomizify({
  custom_classes: {
    mono: `font-family: 'IBM Plex Mono'`,
    h1: 'height: 1px',
    h4: 'height: 4px',
    mr_auto: 'margin-right: auto',
    w_fit_content: 'width: fit-content',
  },
})

export const { Component, Div } = flagify()
