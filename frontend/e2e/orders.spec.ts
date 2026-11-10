import { expect, test } from '@playwright/test'

const API_URL = 'http://127.0.0.1:8000'

test('commander décrémente le stock', async ({ page, request }) => {
  // Création d'un drop indépendant via l'API.
  const createResponse = await request.post(`${API_URL}/drops`, {
    data: {
      product: `E2E Stock ${Date.now()}`,
      description: 'Drop créé pour le test E2E',
      price_cents: 18000,
      stock: 2,
      opens_at: new Date(Date.now() - 60_000).toISOString(),
    },
  })

  expect(createResponse.status()).toBe(201)

  const drop = await createResponse.json()

  // Ouverture de la page du drop.
  await page.goto(`/drops/${drop.id}`)

  await expect(
    page.getByTestId('remaining'),
  ).toHaveText('2 / 2 paires restantes')

  // Première commande.
  await page.getByRole('button', { name: 'Commander' }).click()

  await expect(page.getByTestId('remaining')).toHaveText(
    '1 / 2 paires restantes',
  )

  // Deuxième commande : dernière paire.
  await page.getByRole('button', { name: 'Commander' }).click()

  await expect(page.getByTestId('remaining')).toHaveText(
    '0 / 2 paires restantes',
  )

  await expect(page.getByText('Épuisé')).toBeVisible()
})

test('un drop épuisé désactive le bouton', async ({ page, request }) => {
  // Création d'un drop avec une seule paire.
  const createResponse = await request.post(`${API_URL}/drops`, {
    data: {
      product: `E2E Sold Out ${Date.now()}`,
      description: 'Drop épuisé pour le test E2E',
      price_cents: 18000,
      stock: 1,
      opens_at: new Date(Date.now() - 60_000).toISOString(),
    },
  })

  expect(createResponse.status()).toBe(201)

  const drop = await createResponse.json()

  // On consomme la dernière paire via l'API.
  const orderResponse = await request.post(
    `${API_URL}/drops/${drop.id}/orders`,
  )

  expect(orderResponse.status()).toBe(201)

  // On ouvre ensuite la page du drop épuisé.
  await page.goto(`/drops/${drop.id}`)

  await expect(page.getByTestId('remaining')).toHaveText(
    '0 / 1 paires restantes',
  )

  const button = page.getByRole('button', { name: 'Épuisé' })

  await expect(button).toBeVisible()
  await expect(button).toBeDisabled()
})