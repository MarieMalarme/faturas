import { useState, useEffect } from 'react'
import { Component, Div, fetch_data, update_data, array, add0 } from './lib.js'
import { Icon } from './icons.js'

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
    .sort((a, b) => a.timestamp - b.timestamp)

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
            mode={mode}
          />
        ))}
        {Placeholders}
      </Faturas>
    </Container>
  )
}

const Fatura = ({ fatura, faturas, set_faturas, mode }) => {
  const { timestamp, scope, registered, id } = fatura
  const grid = mode === 'grid'
  const rows = mode === 'rows'

  const date = new Date(timestamp * 1000)
  const day = add0(date.getDate())
  const month = add0(date.getMonth() + 1)

  const Container = (grid && Card) || (rows && Row)

  return (
    <Container>
      <Infos order1={grid} order3={rows} flex2={rows}>
        <Day flex1={rows}>
          {day}.{month}
        </Day>
        <Scope flex1={rows}>{scope}</Scope>
      </Infos>
      {Object.entries(inputs).map((input) => (
        <Input
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
  const [key, { component, classes }] = input
  const Component = component
  const other_faturas = faturas.filter((f) => f.id !== fatura.id)
  const flags = Object.assign(
    {},
    ...classes[mode].map((classe) => ({ [classe]: true })),
  )

  return (
    <Component
      spellcheck="false"
      value={fatura[key]}
      text_center={mode === 'grid'}
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

const Day = Component.fs11.mono.ls1.div()
const Scope = Component.uppercase.fs10.ls2.div()
const Name = Component.fs20.w100p.ba0.ol_none.input()
const Seller = Component.mono.grey3.fs12.w100p.ba0.ol_none.h_auto.textarea()
const Price = Component.order4.fs15.mono.ls1.w100p.ba0.ol_none.input()

const Placeholders = array(5).map((e) => <Div key={e} w15p />)
const categories = ['pending', 'unregistered', 'registered']
const modes = ['grid', 'rows']

const inputs = {
  name: {
    component: Name,
    classes: { grid: ['order2', 'fs22', 'mt20'], rows: ['order1', 'flex1'] },
  },
  seller: {
    component: Seller,
    classes: {
      grid: ['order3', 'mb20', 'mt10', 'h30'],
      rows: ['order2', 'flex2', 'h20'],
    },
  },
  price: { component: Price, classes: { grid: ['mb20'], rows: ['flex1'] } },
}

export default App
