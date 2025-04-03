import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls on Submit', async () => {
    const createNote = vi.fn() // Mock function to simulate creating a note
    const user = userEvent.setup() // Set up user event simulation

    const { container } = render(<NoteForm createNote={createNote} />) // Render the NoteForm component with the mock function as a prop
    // Note: The container is used to query elements within the rendered component.

    const input = container.querySelector('#note-input') // Get the input field by its ID (note-input)
    const sendButton = screen.getByText('save') // Get the button by its text (save)

    await user.type(input, 'testing a form...') // Simulate typing into the input field
    await user.click(sendButton) // Simulate clicking the save button

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...') // Check that the first argument of the first call to createNote has the correct content
})