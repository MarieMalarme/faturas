import { useState, useEffect } from 'react'
import { Icon } from './icons.js'
import { Metrics } from './Metrics.js'
import { Category } from './Faturas.js'
import { Component, fetch_data, update_data } from './lib.js'

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
      <Metrics faturas={faturas} />
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

export const Input = ({ input, mode, data, datas, set_datas }) => {
  const [key, { component, placeholder, classes }] = input
  const Component = component
  const other_datas = datas.filter((f) => f.id !== data.id)
  const flags =
    mode &&
    Object.assign({}, ...classes[mode].map((classe) => ({ [classe]: true })))

  return (
    <Component
      spellCheck="false"
      defaultValue={data[key]}
      text_center={mode === 'grid'}
      placeholder={placeholder}
      onChange={({ target }) => {
        set_datas([...other_datas, { ...data, [key]: target.value }])
        update_data(
          `${mode ? 'faturas/' : 'invoices/'}${data.id}`,
          set_datas,
          { [key]: target.value },
          500,
        )
      }}
      {...flags}
    />
  )
}

const Page = Component.pa100.div()
const Header = Component.flex.jc_between.ai_baseline.div()
const Title = Component.fs60.grey6.mono.div()
const Modes = Component.as_center.flex.w50.ai_center.jc_between.ml60.mt30.mr_auto.div()
const Link = Component.text_dec_none.grey6.bb.b_grey2.a()

const categories = ['pending', 'unregistered', 'registered']
const modes = ['grid', 'rows']

export default App
