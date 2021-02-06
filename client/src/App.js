import { useState, useEffect } from 'react'
import { Component } from './lib.js'

export const fetch_data = async (path, set_data) => {
  const response = await fetch(`http://localhost:5000/${path}`)
  const data = await response.json()
  if (!data) return
  set_data(data)
}

const App = () => {
  const [faturas, set_faturas] = useState([])

  useEffect(() => {
    fetch_data('faturas', set_faturas)
  }, [faturas.length, set_faturas])

  return (
    <Page>
      <Header>
        <Title>Faturas</Title>
        <Link
          href="https://faturas.portaldasfinancas.gov.pt/consultarDocumentosAdquirente.action"
          target="_blank"
        >
          Portal das Finanças
        </Link>
      </Header>
      {categories.map((category) => (
        <Faturas key={category} faturas={faturas} category={category} />
      ))}
    </Page>
  )
}

const Faturas = ({ faturas, category }) => {
  const registered_category = category === 'registered'
  const filtered_faturas = faturas.filter(
    ({ registered, status }) =>
      (registered_category && registered) ||
      (!registered && status === category),
  )

  return (
    <Table>
      <Section
        grey3={registered_category}
        b_grey2={registered_category}
        sapphire4={!registered_category}
        b_sapphire2={!registered_category}
      >
        {category}
      </Section>
      {filtered_faturas.map((fatura) => (
        <Fatura key={fatura.id} fatura={fatura} />
      ))}
    </Table>
  )
}

const Fatura = ({ fatura }) => {
  const { name, seller, price, date, category, scope, registered } = fatura
  return (
    <Row>
      <Column>{name}</Column>
      <Column>{seller}</Column>
      <Column>{price}</Column>
      <Column>{date}</Column>
      <Column>{category}</Column>
      <Column>{scope}</Column>
      <Button ba={registered} shadow_a_s={!registered}>
        {registered && 'un'}register
      </Button>
    </Row>
  )
}

const Page = Component.pa100.div()
const Header = Component.flex.jc_between.ai_baseline.div()
const Title = Component.fs60.grey6.mono.div()
const Link = Component.text_dec_none.grey6.bb.b_grey2.a()
const Table = Component.mt100.div()
const Section = Component.fs18.mb25.pv10.uppercase.mono.ls2.bb.div()
const Row = Component.flex.ai_center.bb.b_grey2.pv20.div()
const Column = Component.flex1.div()
const Button = Component.w110.text_center.b_rad4.c_pointer.pv5.ph15.uppercase.fs10.ls2.b_grey2.div()

const categories = ['pending', 'unregistered', 'registered']

export default App
