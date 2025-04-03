import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn() // Create a mock function to simulate the toggleImportance function

  render(<Note note={note} toggleImportance={mockHandler}/>)

  const user = userEvent.setup() // Set up a session to interact with the rendered component
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1) // Check that the mock function was called once

  // ...

})

test('when ')