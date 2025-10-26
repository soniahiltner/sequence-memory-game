import { cleanup, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Button } from './Button'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
  const mockHandleClick = vi.fn()
  const numberItem = {
    id: 1,
    keytrigger: 'Q',
    key: 81,
    number: 5,
    src: 'test-audio.mp3'
  }
  const src = 'test-audio.mp3'

  afterEach(cleanup)

  it('renders the button with correct number', () => {
    render(
      <Button
        number={numberItem}
        handleClick={mockHandleClick}
      />
    )
    const buttonElement = screen.getByText('5')
    expect(buttonElement).toBeInTheDocument()
  })

  it('calls handleClick with correct parameters on click', async () => {
    render(
      <Button
        number={numberItem}
        handleClick={mockHandleClick}
      />
    )
    const buttonElement = screen.getByText('5')
    await userEvent.click(buttonElement)
    expect(mockHandleClick).toHaveBeenCalledWith(1, src)
  })
})
