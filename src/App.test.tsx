import { render, screen, cleanup } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { App } from './App'

describe('App Component', () => {
  afterEach(cleanup)

  it('renders the initial state ', () => {
    render(<App />)
    const displayElement = screen.getByText('select a level and play!')
    
    expect(displayElement).toBeInTheDocument()
  })

  
})
