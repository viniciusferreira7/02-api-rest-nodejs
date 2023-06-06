import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3500,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list a transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 3500,
      }),
    ])
  })

  it('should be able to get specific transaction ', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 3500,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    console.log(getTransactionResponse.body)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'New transaction',
        amount: 3500,
      }),
    )
  })

  it('should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 3000,
        type: 'debit',
      })

    const SummaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    console.log(SummaryResponse.body)

    // expect(SummaryResponse.body.summary).toEqual({
    //   amount: 2000,
    // })
  })
})
