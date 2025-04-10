const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')


describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await page.goto('/')
        await request.post('/api/testing/reset') // reset the database
        await request.post('/api/users', {
            data: {
                name: "root user",
                username: "root",
                password: "password"
            }
        })

        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, made by Shawn & Department of Computer Science, University of Helsinki 2025')).toBeVisible()
    })

    test('user can login with correct credentials', async ({ page }) => {
        await loginWith(page, 'root', 'password')
        await expect(page.getByText('root user logged-in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
        await loginWith(page, 'root', 'wrongpassword')
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('root user logged-in')).not.toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'root', 'password')
        })

        test('a new note can be created', async ({ page }) => {
            await createNote(page, 'a note created by playwright')
            await expect(page.getByText('a note created by playwright')).toBeVisible()
        })   
        
        describe('and a note exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'another note created by playwright')
            })
        
            test('importance can be changed', async ({ page }) => {
                await page.getByRole('button', { name: 'make not important' }).click()
                await expect(page.getByText('make important')).toBeVisible()
            })
        })
    })

})

