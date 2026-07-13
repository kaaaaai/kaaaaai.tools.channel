import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const itemSource = readFileSync(new URL('./item.astro', import.meta.url), 'utf8')

describe('timeline card motion', () => {
  it('uses a slow linear-breath hover transition with subtle lift', () => {
    expect(itemSource).toContain('duration-[420ms]')
    expect(itemSource).toContain('ease-[cubic-bezier(0.37,0,0.63,1)]')
    expect(itemSource).toContain('group-hover:-translate-y-0.5')
    expect(itemSource).toContain('group-hover:translate-x-0.5')
    expect(itemSource).toContain('group-hover:shadow-[0_14px_34px_-30px_rgba(225,106,15,0.32),0_8px_24px_-22px_rgba(15,23,42,0.22)]')
  })
})
