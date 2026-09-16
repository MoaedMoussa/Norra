import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigurationPanel from '../ConfigurationPanel';
import { vi } from 'vitest';

// Mock the hooks and API
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('../../api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('ConfigurationPanel', () => {
  const mockChatbot = {
    id: 'test-bot-123',
    model: 'gemini-3.7-flash',
    temperature: 0.5,
    searchGrounding: true,
    fewShotExamples: [],
  };

  const mockSetChatbot = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders core configuration options', () => {
    const { container } = render(<ConfigurationPanel chatbot={mockChatbot} setChatbot={mockSetChatbot} id="test-bot-123" />);
    
    // Check for sections
    expect(screen.getByText('AI Intelligence & Model Engine')).toBeInTheDocument();
    expect(screen.getByText('Specialized Tuning & Few-Shot Examples')).toBeInTheDocument();
    
    // Check initial values
    const modelSelect = container.querySelector('select');
    expect(modelSelect.value).toBe('gemini-3.7-flash');
  });

  it('adds a new few-shot example when fields are filled', async () => {
    render(<ConfigurationPanel chatbot={mockChatbot} setChatbot={mockSetChatbot} id="test-bot-123" />);
    
    const user = userEvent.setup();
    const userQuestionInput = screen.getByPlaceholderText(/User question/i);
    const expectedResponseInput = screen.getByPlaceholderText(/Expected exact AI response/i);
    const addButton = screen.getByRole('button', { name: /Add Example Pair/i });

    await user.type(userQuestionInput, 'Hello bot');
    await user.type(expectedResponseInput, 'Hello user');
    await user.click(addButton);

    expect(mockSetChatbot).toHaveBeenCalledTimes(1);
    
    const updateCall = mockSetChatbot.mock.calls[0][0];
    expect(updateCall.fewShotExamples).toHaveLength(1);
    expect(updateCall.fewShotExamples[0].user).toBe('Hello bot');
    expect(updateCall.fewShotExamples[0].assistant).toBe('Hello user');
  });

  it('toggles search grounding correctly', async () => {
    render(<ConfigurationPanel chatbot={mockChatbot} setChatbot={mockSetChatbot} id="test-bot-123" />);
    
    const user = userEvent.setup();
    // Use the first checkbox which should be search grounding
    const checkboxes = screen.getAllByRole('checkbox');
    const groundingCheckbox = checkboxes[0];
    expect(groundingCheckbox).toBeChecked(); // Grounding is true by default in mock

    await user.click(groundingCheckbox);
    
    expect(mockSetChatbot).toHaveBeenCalledTimes(1);
    const updateCall = mockSetChatbot.mock.calls[0][0];
    expect(updateCall.searchGrounding).toBe(false);
  });
});
