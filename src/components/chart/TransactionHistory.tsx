import React, { useEffect, useState } from "react"
import { Table, message } from "antd"
import { formattedDate } from "@/utils/func"

interface TransactionHistoryProps {
  startDate: Date
  endDate: Date
}

interface Transaction {
  transaction_info: {
    transaction_id: string
    transaction_initiation_date: string
    transaction_amount: {
      value: string
      currency_code: string
    }
    transaction_status: string
  }
  payer_info?: {
    email_address?: string
    payer_name?: {
      given_name?: string
      surname?: string
    }
  }
  cart_info?: {
    item_details?: {
      item_name?: string
      item_quantity?: string
      item_unit_price?: {
        currency_code: string
        value: string
      }
      item_amount?: {
        currency_code: string
        value: string
      }
      total_item_amount?: {
        currency_code: string
        value: string
      }
    }[]
  }
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  startDate,
  endDate,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const clientId = import.meta.env.VITE_SANDBOX_PAYPAL_CLIENT_ID
  const clientSecret = import.meta.env.VITE_SANDBOX_PAYPAL_CLIENT_SECRET
  const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
  }
  const body = "grant_type=client_credentials"

  const getToken = async () => {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body,
    })
    const data = await res.json()
    return data?.access_token
  }

  const fetchTransactions = async () => {
    try {
      const formatStartDate = new Date(startDate).toISOString()
      const formatEndDate = new Date(endDate).toISOString()

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
      const sortedTransactions = data.transaction_details
        .filter(
          (transaction: Transaction) =>
            transaction.transaction_info.transaction_status === "S" &&
            parseFloat(transaction.transaction_info.transaction_amount.value) >
              0
        )
        .sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.transaction_info.transaction_initiation_date).getTime() -
            new Date(a.transaction_info.transaction_initiation_date).getTime()
        )

      setTransactions(sortedTransactions || [])
    } catch (error) {
      message.error("Failed to fetch transactions")
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [startDate, endDate])

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: ["transaction_info", "transaction_id"],
      key: "transaction_id",
    },
    {
      title: "Date",
      dataIndex: ["transaction_info", "transaction_initiation_date"],
      key: "date",
      render: (text: string) => formattedDate(new Date(text)),
    },
    {
      title: "Amount",
      dataIndex: ["transaction_info", "transaction_amount", "value"],
      key: "amount",
      render: (text: string, record: Transaction) =>
        `${text} ${record.transaction_info.transaction_amount.currency_code}`,
    },
    {
      title: "Status",
      dataIndex: ["transaction_info", "transaction_status"],
      key: "status",
      render: (status: string) => (status === "S" ? "Completed" : "Pending"),
    },
    {
      title: "Payer Name",
      dataIndex: ["payer_info", "payer_name"],
      key: "payer_name",
      render: (payer_name: { given_name?: string; surname?: string } = {}) =>
        payer_name && payer_name.given_name && payer_name.surname
          ? `${payer_name.given_name} ${payer_name.surname}`
          : "N/A",
    },
    {
      title: "Payer Email",
      dataIndex: ["payer_info", "email_address"],
      key: "email_address",
      render: (email_address: string = "N/A") => email_address || "N/A",
    },
    {
      title: "Product Name",
      dataIndex: ["cart_info", "item_details"],
      key: "product_name",
      render: (items: { item_name?: string }[] = []) =>
        items.length > 0
          ? items.map((item) => item.item_name || "N/A").join(", ")
          : "N/A",
    },
    {
      title: "Product Amount",
      dataIndex: ["cart_info", "item_details"],
      key: "product_amount",
      render: (
        items: { item_amount?: { value: string; currency_code: string } }[] = []
      ) =>
        items.length > 0
          ? items
              .map((item) =>
                item.item_amount
                  ? `${item.item_amount.value} ${item.item_amount.currency_code}`
                  : "N/A"
              )
              .join(", ")
          : "N/A",
    },
  ]

  return (
    <Table
      dataSource={transactions}
      columns={columns}
      rowKey={(record) => record.transaction_info.transaction_id}
    />
  )
}

export default TransactionHistory
