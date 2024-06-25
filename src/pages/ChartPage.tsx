import React, { useEffect, useState } from "react"
import { Button, Col, DatePicker, Empty, Form, FormProps, Row } from "antd"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import LineChart from "@/components/chart/LineChart"
import CustomContent from "@/components/common/CustomContent"
import CustomHeader from "@/components/common/CustomHeader"
import TransactionHistory from "@/components/chart/TransactionHistory"
import { formatDateDDMM, formattedDate } from "@/utils/func"

dayjs.extend(customParseFormat)

const dateFormat = "YYYY-MM-DD"

interface FieldType {
  start_date: Date
  end_date: Date
}

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
}

const clientId = import.meta.env.VITE_SANDBOX_PAYPAL_CLIENT_ID
const clientSecret = import.meta.env.VITE_SANDBOX_PAYPAL_CLIENT_SECRET
const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
  Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
}
const body = "grant_type=client_credentials"

const examLabels = ["Doanh thu", "Chi phí", "Lợi nhuận"]
const examValues = [12, 19, 3]

const ChartPage = () => {
  const today = new Date()
  const monthAgo = new Date(today)
  monthAgo.setDate(monthAgo.getDate() - 29)

  const [values, setValues] = useState(examValues)
  const [labels, setLabels] = useState(examLabels || [])
  const [startDate, setStartDate] = useState<Date>(monthAgo)
  const [endDate, setEndDate] = useState<Date>(today)

  const getToken = async () => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
    })
    const data = await res.json()
    return data?.access_token
  }

  const getDataTransaction = async () => {
    const formatStartDate = formattedDate(startDate)
    const formatEndDate = formattedDate(endDate)

    const accessToken = await getToken()
    const res = await fetch(
      `https://api-m.sandbox.paypal.com/v1/reporting/transactions?start_date=${formatStartDate}&end_date=${formatEndDate}&fields=all`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    const data = await res.json()

    const result = await data?.transaction_details
      ?.filter(
        (invoice: any) =>
          parseFloat(invoice?.transaction_info?.transaction_amount?.value) > 0
      )
      .map((invoice: any) => ({
        label: formatDateDDMM(
          invoice?.transaction_info?.transaction_initiation_date
        ),
        value: invoice?.transaction_info?.transaction_amount?.value,
      }))

    setLabels(result.map((invoice: any) => invoice.label))
    setValues(result.map((invoice: any) => invoice.value))
    return data
  }

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setStartDate(values.start_date)
    setEndDate(values.end_date)
  }

  useEffect(() => {
    getDataTransaction()
  }, [startDate, endDate])

  return (
    <div>
      <CustomHeader title="Thống kê" />

      <CustomContent>
        {labels?.length > 0 ? (
          <Row>
            <Col span={12}>
              <LineChart labels={labels} values={values} />
            </Col>

            <Col span={12}>
              <Form
                name="chart"
                layout="vertical"
                onFinish={onFinish}
                validateMessages={validateMessages}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Form.Item<FieldType>
                    name={"start_date"}
                    label="Start Date"
                    initialValue={dayjs(formattedDate(startDate), dateFormat)}
                  >
                    <DatePicker maxDate={dayjs(endDate)} />
                  </Form.Item>
                  <Form.Item<FieldType>
                    name={"end_date"}
                    label="End Date"
                    initialValue={dayjs(formattedDate(endDate), dateFormat)}
                  >
                    <DatePicker
                      minDate={dayjs(startDate)}
                      maxDate={dayjs(endDate)}
                    />
                  </Form.Item>
                </div>

                <div className="flex items-center justify-end gap-4 w-full mt-10">
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        ) : (
          <Empty />
        )}

        {/* Add the TransactionHistory component */}
        <TransactionHistory startDate={startDate} endDate={endDate} />
      </CustomContent>
    </div>
  )
}

export default ChartPage
