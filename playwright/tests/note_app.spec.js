const { test, expect, describe } = require('@playwright/test')


describe('Note app', () => {

    test('front page can be opened', async ({ page }) => {
        await page.goto('http://localhost:5173')
    
        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, made by Shawn & Department of Computer Science, University of Helsinki 2025')).toBeVisible()
    })

    test('login form can be opened', async ({ page}) => {
        await page.goto('http://localhost:5173')

        await page.getByRole('button', { name: 'login' }).click()
        await page.getByRole('textbox').first().fill('root')
        await page.getByRole('textbox').last().fill('password')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('root user logged-in')).toBeVisible()
    })

})