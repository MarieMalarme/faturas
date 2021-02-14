import { useState, useEffect } from 'react'
import { Icon } from './icons.js'
import {
  Component,
  Div,
  fetch_data,
  send_data,
  update_data,
  array,
  get_today_date,
} from './lib.js'

const App = () => {
  const [mode, set_mode] = useState('grid')
  const [faturas, set_faturas] = useState([])

  useEffect(() => {
    fetch_data('faturas', set_faturas)
  }, [faturas.length, set_faturas])

  return (
    <Page>
      <Header>
        <Title>Faturas</Title>
        <Modes>
          {modes.map((type) => (
            <Icon key={type} type={type} mode={mode} set_mode={set_mode} />
          ))}
        </Modes>
        <Link
          href="https://faturas.portaldasfinancas.gov.pt/consultarDocumentosAdquirente.action"
          target="_blank"
        >
          Portal das Finanças
        </Link>
      </Header>
      {categories.map((category, i) => (
        <Category
          key={category}
          faturas={faturas}
          set_faturas={set_faturas}
          category={category}
          mode={mode}
        />
      ))}
    </Page>
  )
}

const Category = ({ faturas, set_faturas, category, mode }) => {
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
        <NewFatura
          category={category}
          mode={mode}
          faturas={faturas}
          set_faturas={set_faturas}
        />
        {filtered_faturas.map((fatura, i) => (
          <Fatura
            key={fatura.id}
            fatura={fatura}
            faturas={faturas}
            set_faturas={set_faturas}
            mode={mode}
          />
        ))}
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
      b_sapphire2
      bb0={rows}
      fs50={grid}
      sapphire2={grid}
      sapphire4={rows}
      jc_center={grid}
      w_fit_content={rows}
      onClick={() => {
        const id = faturas.length + 1
        const updated_at = new Date()
        const registered = category === 'registered'
        const status = !registered ? category : 'unregistered'
        const new_fatura = { id, updated_at, status, registered }
        send_data('post', 'faturas', set_faturas, new_fatura)
      }}
    >
      +{rows && <Add>New fatura</Add>}
    </Container>
  )
}

const Fatura = ({ fatura, faturas, set_faturas, mode, category }) => {
  const {
    date = get_today_date(),
    scope = 'perso',
    registered = category === 'registered',
    id,
  } = fatura

  const grid = mode === 'grid'
  const rows = mode === 'rows'
  const perso = scope === 'perso'

  const Container = (grid && Card) || (rows && Row)

  return (
    <Container>
      <Infos order1={grid} order3={rows} flex2={rows}>
        <DatePicker flex1={rows}>
          <Day
            value={date}
            type="date"
            o30={!fatura.date}
            onChange={({ target }) =>
              update_data(id, set_faturas, { date: target.value }, 0)
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
            update_data(id, set_faturas, { scope: scopes[next_index] }, 10)
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
          fatura={fatura}
          faturas={faturas}
          set_faturas={set_faturas}
        />
      ))}
      <Registration registered={registered} id={id} set_faturas={set_faturas} />
    </Container>
  )
}

const Input = ({ input, mode, fatura, faturas, set_faturas }) => {
  const [key, { component, placeholder, classes }] = input
  const Component = component
  const other_faturas = faturas.filter((f) => f.id !== fatura.id)
  const flags = Object.assign(
    {},
    ...classes[mode].map((classe) => ({ [classe]: true })),
  )

  return (
    <Component
      spellCheck="false"
      value={fatura[key]}
      text_center={mode === 'grid'}
      placeholder={placeholder}
      onChange={({ target }) => {
        set_faturas([...other_faturas, { ...fatura, [key]: target.value }])
        update_data(fatura.id, set_faturas, { [key]: target.value }, 500)
      }}
      {...flags}
    />
  )
}

const Registration = ({ id, registered, set_faturas }) => (
  <Button
    onClick={() => update_data(id, set_faturas, { registered: !registered })}
  >
    {registered && 'un'}register
  </Button>
)

const Page = Component.pa100.div()
const Header = Component.flex.jc_between.ai_baseline.div()
const Title = Component.fs60.grey6.mono.div()
const Modes = Component.as_center.flex.w50.ai_center.jc_between.ml60.mt30.mr_auto.div()
const Link = Component.text_dec_none.grey6.bb.b_grey2.a()
const Section = Component.fs18.mb25.pv10.uppercase.mono.ls2.bb.div()
const Button = Component.order5.ba.hover_bg_grey1.w110.text_center.b_rad20.c_pointer.pv5.ph15.uppercase.fs10.ls2.b_grey2.div()

const Container = Component.mt100.div()
const Row = Component.flex.ai_baseline.bb.b_grey2.pv20.div()
const Grid = Component.mt50.flex.flex_wrap.jc_between.div()
const Card = Component.w15p.ai_center.ba.pt15.pb30.ph15.mb25.b_grey2.flex.flex_column.div()
const Infos = Component.flex.jc_between.w100p.uppercase.fs10.div()
const Add = Component.ml15.fs12.uppercase.mono.ls1.div()

const DatePicker = Component.relative.div()
const Day = Component.fs11.mono.ls1.ba0.ol_none.pa0.w50.input()
const Hider = Component.absolute.bg_white.w10.h20.div()
const Scope = Component.uppercase.fs10.ls2.div()
const Name = Component.fs20.w100p.ba0.ol_none.input()
const Seller = Component.mono.grey3.fs12.w100p.ba0.ol_none.h_auto.textarea()
const Price = Component.order4.fs15.mono.ls1.w100p.ba0.ol_none.input()

const Placeholders = array(5).map((e) => <Div key={e} w15p />)
const categories = ['pending', 'unregistered', 'registered']
const scopes = ['pro', 'semi', 'perso']
const modes = ['grid', 'rows']

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
  price: {
    component: Price,
    placeholder: '19.99',
    classes: { grid: ['mb20'], rows: ['flex1'] },
  },
}

export default App
