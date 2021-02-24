import { Component } from './flags.js'
import { array } from './toolbox.js'

export const Icon = ({ mode, set_mode, type }) => {
  const grid = type === 'grid'
  const rows = type === 'rows'
  const selected = mode === type
  const IconType = (grid && Square) || (rows && Line)

  return (
    <Wrapper
      o20={!selected}
      hover_o50={!selected}
      anim_opacity={!selected}
      flex_column={rows}
      ac_between={grid}
      flex_wrap={grid}
      onClick={() => set_mode(type)}
    >
      {array(4).map((e) => (
        <IconType key={e} bg_grey8={!selected} bg_sapphire2={selected} />
      ))}
    </Wrapper>
  )
}

const Wrapper = Component.w15.h15.flex.jc_between.c_pointer.div()
const Line = Component.w100p.bg_grey8.h1.div()
const Square = Component.w40p.bg_grey8.h40p.div()
