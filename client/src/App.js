import { useState, useEffect } from 'react'
import { Icon } from './icons.js'
import {
  Component,
  Div,
  fetch_data,
  send_data,
  update_data,
  delete_data,
  array,
  get_today_date,
  get_total_amount,
  get_pro_amount,
} from './lib.js'

const App = () => {
  const [mode, set_mode] = useState('grid')
  const [faturas, set_faturas] = useState([])
  const [invoiced, set_invoiced] = useState(5500)
  const goal = invoiced * 0.15

  const metrics = {
    total: get_total_amount(faturas),
    professional: get_pro_amount(faturas),
  }

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
      <Metrics>
        {Object.entries(metrics).map(([caption, metric]) => (
          <Metric caption={caption} metric={metric} />
        ))}
        <Graph metrics={metrics} invoiced={invoiced} goal={goal} />
        <Amounts
          invoiced={invoiced}
          set_invoiced={set_invoiced}
          metrics={metrics}
          goal={goal}
        />
      </Metrics>
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

const Metric = ({ caption, metric }) => (
  <Div mr100>
    <Caption>{caption}</Caption>
    <Data>{metric}</Data>
  </Div>
)

const Graph = ({ metrics, invoiced, goal }) => {
  const current_amount = metrics.professional
  const percentage = current_amount / goal

  return (
    <Div mt25 w200 h4 bg_grey1>
      <Div h4 bg_sapphire2 style={{ width: `${percentage * 100}%` }} />
    </Div>
  )
}

const Amounts = ({ invoiced, set_invoiced, metrics, goal }) => (
  <Div ml100>
    <Caption grey6 flex ai_center>
      Invoiced{' '}
      <Invoiced
        type="text"
        value={invoiced}
        onChange={({ target }) => set_invoiced(target.value)}
      />
    </Caption>
    <Caption grey6>
      Goal<Amount>{goal}</Amount>
    </Caption>
    <Caption grey6>
      Remaining<Amount>{goal - metrics.professional}</Amount>
    </Caption>
  </Div>
)

const Category = ({ faturas, set_faturas, category, mode }) => {
  const Faturas = (mode === 'grid' && Grid) || Div
  const registered_category = category === 'registered'
  const filtered_faturas = faturas
    .filter(
      ({ registered, status }) =>
        (registered_category && registered) ||
        (!registered && status === category),
    )
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

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
        const id = faturas.length + 1
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

const Fatura = ({ fatura, faturas, set_faturas, mode, category }) => {
  const [display, set_display] = useState(false)
  const { date, scope, registered, id } = fatura
  const grid = mode === 'grid'
  const rows = mode === 'rows'
  const perso = scope === 'perso'

  const Container = (grid && Card) || (rows && Row)

  return (
    <Container
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
        onClick={() => delete_data(id, set_faturas)}
      >
        ×
      </Delete>
      <Infos order1={grid} order3={rows} flex2={rows}>
        <DatePicker flex1={rows}>
          <Day
            value={date}
            type="date"
            onChange={({ target }) =>
              update_data(id, set_faturas, { date: target.value })
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
            update_data(id, set_faturas, { scope: scopes[next_index] })
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
      <Registration
        id={id}
        mb10={grid}
        registered={registered}
        set_faturas={set_faturas}
      />
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

const Registration = ({ id, registered, set_faturas, ...props }) => (
  <Button
    onClick={() => update_data(id, set_faturas, { registered: !registered })}
    {...props}
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
const Button = Component.order5.ba.hover_b_grey3.anim_border.w110.text_center.b_rad20.c_pointer.pv5.ph15.uppercase.fs10.ls2.b_grey2.div()

const Metrics = Component.mt90.flex.ai_center.div()
const Caption = Component.capitalize.mb10.mono.fs13.div()
const Data = Component.fs50.mono.grey6.div()
const Invoiced = Component.ml15.ba0.bb.pa0.input()
const Amount = Component.ml15.black.span()

const Container = Component.mt100.div()
const Row = Component.flex.ai_baseline.bb.b_grey2.pv20.div()
const Grid = Component.mt50.flex.flex_wrap.jc_between.div()
const Card = Component.w15p.ai_center.ba.pt15.pb30.ph15.mb35.b_grey2.flex.flex_column.min_h240.div()
const Infos = Component.flex.jc_between.w100p.uppercase.fs10.div()
const Add = Component.ml15.fs12.uppercase.mono.ls1.div()
const Delete = Component.o0.anim_opacity.grey5.ph30.c_pointer.absolute.div()

const DatePicker = Component.relative.div()
const Day = Component.fs11.mono.ls1.ba0.ol_none.pa0.w50.input()
const Hider = Component.absolute.bg_white.w10.h20.div()
const Scope = Component.uppercase.fs10.ls2.c_pointer.div()
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
