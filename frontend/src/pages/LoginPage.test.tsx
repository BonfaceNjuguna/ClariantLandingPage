import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LoginPage from './LoginPage';
import { AuthContext } from '../context/AuthContext';

const { mockLoginWithToken, mockLoginPopup } = vi.hoisted(() => {
    return {
        mockLoginWithToken: vi.fn(),
        mockLoginPopup: vi.fn(),
    }
});

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn().mockImplementation(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    getAllAccounts: vi.fn().mockReturnValue([]),
    loginPopup: mockLoginPopup,
    acquireTokenSilent: vi.fn(),
  })),
}));

vi.mock('../services/authService', () => ({
  loginWithToken: mockLoginWithToken,
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

  it('renders the login page with a login button', async () => {
    const setUser = vi.fn();
    await act(async () => {
        render(
          <MemoryRouter>
            <AuthContext.Provider value={{ user: null, setUser, logout: vi.fn() }}>
              <LoginPage />
            </AuthContext.Provider>
          </MemoryRouter>
        );
    });
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('triggers authentication on login button click', async () => {
    const setUser = vi.fn();
    mockLoginPopup.mockResolvedValue({ idToken: 'mock-token' });
    mockLoginWithToken.mockResolvedValue({
      email: 'test@clariant.com',
      name: 'Test User',
      token: 'mock-token',
      provider: 'microsoft',
    });

    await act(async () => {
        render(
          <MemoryRouter>
            <AuthContext.Provider value={{ user: null, setUser, logout: vi.fn() }}>
              <LoginPage />
            </AuthContext.Provider>
          </MemoryRouter>
        );
    });

    const loginButton = screen.getByRole('button', { name: /Login/i });
    await act(async () => {
        fireEvent.click(loginButton);
    });


    await waitFor(() => {
      expect(mockLoginPopup).toHaveBeenCalled();
      expect(mockLoginWithToken).toHaveBeenCalledWith('mock-token', 'microsoft');
      expect(setUser).toHaveBeenCalledWith({
        email: 'test@clariant.com',
        name: 'Test User',
        token: 'mock-token',
        provider: 'microsoft',
      });
    });
  });

  it('shows error alert on failed login', async () => {
    const setUser = vi.fn();
    mockLoginPopup.mockRejectedValue(new Error('Login failed'));

    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await act(async () => {
        render(
          <MemoryRouter>
            <AuthContext.Provider value={{ user: null, setUser, logout: vi.fn() }}>
              <LoginPage />
            </AuthContext.Provider>
          </MemoryRouter>
        );
    });

    const loginButton = screen.getByRole('button', { name: /Login/i });
    await act(async () => {
        fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Microsoft login failed');
    });

    alertMock.mockRestore();
  });
});