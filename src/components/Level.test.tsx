import { Level } from './Level'
import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('Level Component', () => {
  const mockHandleLevelClick = vi.fn()
  const currentLevel = { id: '1', name: 'LEVEL 1' }

  afterEach(cleanup)

  it('renders the level buttons', () => {
    render(<Level level={currentLevel} handleClick={mockHandleLevelClick} />)
    const levelButtons = screen.getByText('LEVEL 1')
    expect(levelButtons).toBeInTheDocument()
  })

  it('calls handleClick with the correct level when a button is clicked', async () => {
    render(<Level level={currentLevel} handleClick={mockHandleLevelClick} />)
    const levelButton = screen.getByText('LEVEL 1')
    await userEvent.click(levelButton)
    expect(mockHandleLevelClick).toHaveBeenCalledWith('LEVEL 1')
  })
})
