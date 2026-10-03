import { expect, test, type Page } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready)
}

async function pdfTextByPage(bytes: Buffer): Promise<string[]> {
  const loadingTask = getDocument({
    data: Uint8Array.from(bytes),
  })
  const document = await loadingTask.promise
  const pages: string[] = []

  try {
    for (let index = 1; index <= document.numPages; index += 1) {
      const page = await document.getPage(index)
      const content = await page.getTextContent()
      pages.push(
        content.items
          .filter((item) => 'str' in item)
          .map((item) => item.str)
          .join(' '),
      )
    }
  } finally {
    await loadingTask.destroy()
  }

  return pages
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await waitForFonts(page)
})

test('renders the continuous desktop preview without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 })

  await expect(page.getByRole('heading', { level: 1, name: 'Alex Johnson' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: 'Northstar Labs' })).toBeVisible()
  await expect(page.locator('[data-brand-icon="github"]')).toBeVisible()
  await expect(page.locator('[data-brand-icon="linkedin"]')).toBeVisible()
  await expect(page.locator('[data-brand-icon="credly"]')).toBeVisible()
  await expect(page.locator('.resume-section')).toHaveCount(12)
  await expect(page.getByRole('button', { name: 'Print / Save PDF' })).toBeVisible()

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    resumeWidth: document.querySelector('.resume-document')?.getBoundingClientRect().width,
  }))

  expect(dimensions.documentWidth).toBe(dimensions.viewportWidth)
  expect(dimensions.resumeWidth).toBeCloseTo(793.7, 0)

  const longHighlight = page.locator('.resume-list li').filter({
    hasText: 'Redesigned a fragile release process',
  })
  const wrap = await longHighlight.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      clientWidth: element.clientWidth,
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(style.lineHeight),
      scrollWidth: element.scrollWidth,
    }
  })

  expect(wrap.height).toBeGreaterThan(wrap.lineHeight * 1.5)
  expect(wrap.scrollWidth).toBeLessThanOrEqual(wrap.clientWidth)
})

test('keeps the mobile preview readable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }))

  expect(dimensions.documentWidth).toBe(dimensions.viewportWidth)
  await expect(page.getByRole('button', { name: 'Print / Save PDF' })).toHaveCSS(
    'min-height',
    '44px',
  )
  await expect(page.getByRole('heading', { level: 2, name: 'Skills' })).toBeVisible()

  const longHighlight = page.locator('.resume-list li').filter({
    hasText: 'Redesigned a fragile release process',
  })
  const wrap = await longHighlight.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      clientWidth: element.clientWidth,
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(style.lineHeight),
      scrollWidth: element.scrollWidth,
    }
  })

  expect(wrap.height).toBeGreaterThan(wrap.lineHeight * 2.5)
  expect(wrap.scrollWidth).toBeLessThanOrEqual(wrap.clientWidth)
})

test('exports paginated A4 and Letter PDFs with intact section boundaries', async ({ page }) => {
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.app-toolbar')).toBeHidden()

  const a4Bytes = await page.pdf({
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  })
  const a4Document = await PDFDocument.load(a4Bytes)
  const a4Pages = a4Document.getPages()
  const a4Text = await pdfTextByPage(a4Bytes)

  expect(a4Pages).toHaveLength(2)
  expect(a4Pages[0]?.getWidth()).toBeCloseTo(595.28, 0)
  expect(a4Pages[0]?.getHeight()).toBeCloseTo(841.89, 0)
  expect(a4Text[0]).toContain('RECOGNITION')
  expect(a4Text[0]).toContain('Engineering Impact Award')
  expect(a4Text[1]).toContain('VOLUNTEERING')
  expect(a4Text[1]).toContain('Volunteer Mentor')
  expect(a4Text.join(' ')).toContain('Redesigned a fragile release process')
  expect(a4Text.join(' ')).not.toContain('>')
  expect(a4Text.join(' ')).not.toContain('*')

  await page.locator('.resume-document').evaluate((element) => {
    element.setAttribute('data-page-size', 'letter')
  })
  const letterBytes = await page.pdf({
    preferCSSPageSize: true,
    printBackground: true,
  })
  const letterDocument = await PDFDocument.load(letterBytes)
  const letterPage = letterDocument.getPages()[0]

  expect(letterPage?.getWidth()).toBeCloseTo(612, 0)
  expect(letterPage?.getHeight()).toBeCloseTo(792, 0)
})
