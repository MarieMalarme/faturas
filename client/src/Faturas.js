import { useState } from 'react'
import { Input } from './App.js'
import { Component, Div } from './flags.js'
import { send_data, update_data, delete_data } from './data.js'
import { array, get_today_date, get_new_id } from './toolbox.js'

export const Category = (props) => {
  const { faturas, set_faturas, set_selected, category, mode } = props
  const Faturas = (mode === 'grid' && Grid) || Div
  const registered_category = category === 'registered'
  const filtered_faturas = faturas
    .filter(
      ({ registered, status }) =>
        (registered_category && registered) ||
        (!registered && status === category),
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Container>
      <Section
        grey3={registered_category}
        b_grey2={registered_category}
        sapphire4={!registered_category}
        b_sapphire2={!registered_category}
      >
        {category}
      </Section>
      <Faturas>
        {filtered_faturas.map((fatura, i) => (
          <Fatura
            key={fatura.id}
            fatura={fatura}
            faturas={faturas}
            set_faturas={set_faturas}
            set_selected={set_selected}
            mode={mode}
          />
        ))}
        <NewFatura
          category={category}
          mode={mode}
          faturas={faturas}
          set_faturas={set_faturas}
        />
        {Placeholders}
      </Faturas>
    </Container>
  )
}

const NewFatura = ({ category, mode, faturas, set_faturas }) => {
  const grid = mode === 'grid'
  const rows = mode === 'rows'
  const Container = (grid && Card) || (rows && Row)

  return (
    <Container
      c_pointer
      bb0={rows}
      fs50={grid}
      mt20={rows}
      grey5={grid}
      jc_center={grid}
      w_fit_content={rows}
      onClick={() => {
        const id = get_new_id(faturas)
        const created_at = new Date()
        const registered = category === 'registered'
        const status = !registered ? category : 'unregistered'
        const date = get_today_date()
        const scope = 'perso'
        const new_fatura = { id, created_at, date, status, registered, scope }
        send_data('post', 'faturas', set_faturas, new_fatura)
      }}
    >
      +{rows && <Add>New fatura</Add>}
    </Container>
  )
}

const Fatura = ({ fatura, faturas, set_faturas, set_selected, mode }) => {
  const [display, set_display] = useState(false)
  const { date, scope, registered, id } = fatura
  const grid = mode === 'grid'
  const rows = mode === 'rows'
  const perso = scope === 'perso'
  const Container = (grid && Card) || (rows && Row)

  return (
    <Container
      id={`fatura-${id}`}
      onClick={({ target }) => {
        target.id === `fatura-${id}` && set_selected(fatura)
      }}
      onMouseOver={() => set_display(true)}
      onMouseLeave={() => set_display(false)}
      relative
    >
      <Delete
        b0={grid}
        pb10={grid}
        pv10={rows}
        o100={display}
        style={{ left: rows && '-70px', top: rows && '12px' }}
        onClick={() => delete_data(`faturas/${id}`, set_faturas)}
      >
        ×
      </Delete>
      <Infos order1={grid} order3={rows} flex2={rows}>
        <DatePicker flex1={rows}>
          <Day
            value={date}
            type="date"
            onChange={({ target }) =>
              update_data(`faturas/${id}`, set_faturas, { date: target.value })
            }
          />
          <Hider style={{ top: '-3px', left: '42px' }} />
        </DatePicker>
        <Scope
          o30={perso}
          flex1={rows}
          onClick={() => {
            const current_index = scopes.indexOf(scope)
            const end_of_array = current_index === scopes.length - 1
            const next_index = end_of_array ? 0 : current_index + 1
            update_data(`faturas/${id}`, set_faturas, {
              scope: scopes[next_index],
            })
          }}
        >
          {(perso && 'pro') || scope}
        </Scope>
      </Infos>
      {Object.entries(inputs).map((input) => (
        <Input
          key={input[0]}
          input={input}
          mode={mode}
          data={fatura}
          datas={faturas}
          set_datas={set_faturas}
          data_type="faturas"
        />
      ))}
      <Registration
        id={id}
        mb10={grid}
        registered={registered}
        set_faturas={set_faturas}
      />
    </Container>
  )
}

const Registration = ({ id, registered, set_faturas, ...props }) => (
  <Button
    onClick={() =>
      update_data(`faturas/${id}`, set_faturas, { registered: !registered })
    }
    {...props}
  >
    {registered && 'un'}register
  </Button>
)

const Section = Component.fs18.mb25.pv10.uppercase.mono.ls2.bb.div()
const Button = Component.order5.ba.hover_b_grey3.anim_border.w110.text_center.b_rad20.c_pointer.pv5.ph15.uppercase.fs10.ls2.b_grey2.div()

const Container = Component.mt100.div()
const Row = Component.c_pointer.flex.ai_baseline.bb.b_grey2.pv20.div()
const Grid = Component.mt50.flex.flex_wrap.jc_between.div()
const Card = Component.c_pointer.w15p.ai_center.ba.pt15.pb30.ph15.mb35.b_grey2.flex.flex_column.min_h240.div()
const Infos = Component.flex.jc_between.w100p.uppercase.fs10.div()
const Add = Component.ml15.fs12.uppercase.mono.ls1.div()
const Delete = Component.o0.anim_opacity.grey5.ph30.c_pointer.absolute.div()

const DatePicker = Component.relative.div()
const Day = Component.fs11.mono.ls1.ba0.ol_none.pa0.w50.input()
const Hider = Component.absolute.bg_white.w10.h20.div()
const Scope = Component.uppercase.fs10.ls2.c_pointer.div()
const Name = Component.fs20.w100p.ba0.ol_none.input()
const Seller = Component.mono.grey4.fs12.w100p.ba0.ol_none.h_auto.textarea()
const Price = Component.order4.fs15.mono.ls1.w100p.ba0.ol_none.input()

const Placeholders = array(5).map((e) => <Div key={e} w15p />)
const scopes = ['pro', 'semi', 'perso']

const inputs = {
  name: {
    component: Name,
    placeholder: 'Groceries',
    classes: { grid: ['order2', 'fs22', 'mt20'], rows: ['order1', 'flex1'] },
  },
  seller: {
    component: Seller,
    placeholder: 'Glovo',
    classes: {
      grid: ['order3', 'mb20', 'mt10', 'h30'],
      rows: ['order2', 'flex2', 'h20'],
    },
  },
  amount: {
    component: Price,
    placeholder: '19.99',
    classes: { grid: ['mb20'], rows: ['flex1'] },
  },
}
