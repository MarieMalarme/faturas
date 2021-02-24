import { useState, useEffect } from 'react'
import { Component } from './flags.js'
import { Input } from './App.js'

export const Modal = ({ selected, set_selected, faturas, set_faturas }) => {
  const [insert, set_insert] = useState(null)
  const [modal, set_modal] = useState(null)

  useEffect(() => {
    if (!insert || !modal || !selected) return
    modal.addEventListener('click', ({ target }) => {
      !insert.contains(target) && set_selected(null)
    })
  }, [insert, selected, set_selected, modal])

  useEffect(() => {
    document.addEventListener('keydown', ({ keyCode }) => {
      keyCode === 27 && set_selected(null)
    })
  })

  if (!selected) return null

  return (
    <Container elemRef={set_modal}>
      <Insert elemRef={set_insert}>
        <Name>{selected.name}</Name>
        <Seller>{selected.seller}</Seller>
        {Object.entries(inputs).map((input) => (
          <Input
            key={input[0]}
            input={input}
            data={selected}
            datas={faturas}
            set_datas={set_faturas}
            data_type="faturas"
          />
        ))}
      </Insert>
    </Container>
  )
}

const Container = Component.t0.l0.h100vh.w100p.zi10.flex.ai_center.jc_center.fixed.div()
const Insert = Component.flex.flex_column.pa50.w300.h50p.shadow_a_s.bg_white.div()
const Name = Component.fs25.mb10.div()
const Seller = Component.mono.fs13.grey4.mb25.div()
const Field = Component.mt10.mono.fs15.grey4.ol_none.ba0.pa0.input()
const TextArea = Component.mt10.h100.mono.fs15.grey4.ol_none.ba0.pa0.textarea()

const inputs = {
  reference: { component: Field, placeholder: 'FS 345/2000' },
  code: { component: Field, placeholder: 'hd7r' },
  infos: { component: TextArea, placeholder: 'Anything else?' },
}
