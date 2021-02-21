import { useState, useEffect } from 'react'
import { Input } from './App.js'
import {
  Component,
  Div,
  get_total_amount,
  get_pro_amount,
  fetch_data,
} from './lib.js'

export const Metrics = ({ faturas }) => {
  const [invoices, set_invoices] = useState([])
  const total_invoices = get_total_amount(invoices)
  const goal = total_invoices * 0.15
  const metrics = {
    total: get_total_amount(faturas),
    professional: get_pro_amount(faturas),
  }

  useEffect(() => {
    fetch_data('invoices', set_invoices)
  }, [invoices.length])

  return (
    <Div mt90 flex ai_center>
      {Object.entries(metrics).map(([caption, metric]) => (
        <Metric key={caption} caption={caption} metric={metric} />
      ))}
      <Graph metrics={metrics} goal={goal} />
      <Amounts
        total_invoices={total_invoices}
        invoices={invoices}
        set_invoices={set_invoices}
        metrics={metrics}
        goal={goal}
      />
    </Div>
  )
}

const Metric = ({ caption, metric }) => (
  <Div mr100>
    <Caption>{caption}</Caption>
    <Data>{metric.toFixed(2)}</Data>
  </Div>
)

const Graph = ({ metrics, goal }) => {
  const current_amount = metrics.professional
  const percentage = current_amount / goal

  return (
    <Div mt25 w200 h4 bg_grey1>
      <Div h4 bg_sapphire2 style={{ width: `${percentage * 100}%` }} />
    </Div>
  )
}

const Amounts = ({ invoices, set_invoices, total_invoices, metrics, goal }) => {
  const [modal, set_modal] = useState(false)
  if (!invoices.length) return null
  const remaining = goal - metrics.professional

  return (
    <Div ml100>
      {modal && <Modal invoices={invoices} set_invoices={set_invoices} />}
      <Caption c_pointer grey6 flex ai_center onClick={() => set_modal(true)}>
        Invoices<Sum>{total_invoices.toFixed(2)}</Sum>
      </Caption>
      <Caption grey6>
        Goal<Sum>{goal.toFixed(2)}</Sum>
      </Caption>
      <Caption grey6>
        Remaining<Sum>{remaining > 0 ? remaining.toFixed(2) : 0}</Sum>
      </Caption>
    </Div>
  )
}

const Modal = ({ invoices, set_invoices }) => {
  return (
    <Div pa100 zi5 fixed t0 l0 w100vw h100vh bg_white>
      <Div fs40 mono mb60>
        Invoices
      </Div>
      <Invoices>
        {invoices
          .sort((a, b) => a.id - b.id)
          .map((invoice) => (
            <Invoice
              key={`invoice-${invoice.id}`}
              invoice={invoice}
              invoices={invoices}
              set_invoices={set_invoices}
            />
          ))}
        <Div w30p />
      </Invoices>
    </Div>
  )
}

const Invoice = ({ invoice, invoices, set_invoices }) => (
  <Div mt30 b_grey2 ai_baseline w30p flex pb10 bb jc_between>
    {Object.entries(inputs).map((input) => (
      <Input
        key={input[0]}
        input={input}
        data={invoice}
        datas={invoices}
        set_datas={set_invoices}
      />
    ))}
  </Div>
)

const Caption = Component.capitalize.mb10.mono.fs13.div()
const Data = Component.fs50.mono.grey6.div()
const Sum = Component.ml15.black.span()

const Invoices = Component.flex.flex_wrap.w100p.jc_between.div()
const Description = Component.mono.w35p.fs14.ol_none.ba0.pa0.input()
const Client = Component.w45p.mono.fs14.grey4.ol_none.ba0.pa0.input()
const Amount = Component.w20p.mono.sapphire4.fs17.ol_none.ba0.text_right.input()

const inputs = {
  description: { component: Description, placeholder: 'Mission' },
  client: { component: Client, placeholder: '01 Talents' },
  amount: { component: Amount, placeholder: '5500' },
}
