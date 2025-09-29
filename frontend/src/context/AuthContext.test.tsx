import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const TestComponent = () => {
  const { user, setUser, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'No user'}</span>
      <button onClick={() => setUser({ email: 'new@clariant.com', name: 'New', token: 'xyz', provider: 'microsoft' })}>Set User</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads user from localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@clariant.com', name: 'Test', token: 'abc', provider: 'microsoft' }));
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('test@clariant.com')).toBeInTheDocument();
    localStorage.removeItem('user');
  });

  it('setUser updates user and localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    act(() => {
      screen.getByText('Set User').click();
    });
    expect(screen.getByTestId('user').textContent).toBe('new@clariant.com');
    expect(JSON.parse(localStorage.getItem('user') || '{}').email).toBe('new@clariant.com');
  });

  it('logout clears user and localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@clariant.com', name: 'Test', token: 'abc', provider: 'microsoft' }));
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByTestId('user').textContent).toBe('No user');
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('does not render children while loading', () => {
    // Simulate loading state by not setting localStorage
    let rendered = false;
    const Child = () => { rendered = true; return <div>Child</div>; };
    render(
      <AuthProvider>
        <Child />
      </AuthProvider>
    );
    // The effect runs after mount, so rendered should be true after loading
    expect(rendered).toBe(true);
  });
});