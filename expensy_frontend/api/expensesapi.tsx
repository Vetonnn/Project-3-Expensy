'use client'
import axios from "axios"
import apiClient from "./apiclient"
// curl -X POST http://localhost:3000/api/expenses -H "Content-Type: application/json" -d '{
//     "name": "Groceries",
//     "amount": 100,
//     "category": "Food"
//   }'

//   curl -X GET http://localhost:3000/api/expenses -H "Content-Type: application/json"


const fetchExpensesAPI = async () => {
   
         const response = await apiclient.get("/expenses")

       return response
   
    }

const addExpensesAPI = async (name: string, amount: number, category: string) => {
    const response = await apiclient.post("/expenses", {
        name,
        amount,
        category
    })
    return response
}

export { fetchExpensesAPI, addExpensesAPI }