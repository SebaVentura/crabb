const MOCK_SESSION_KEY = 'crabb_mock_session'

export const authMock = {
  isLoggedIn: () => localStorage.getItem(MOCK_SESSION_KEY) === '1',
  login: () => localStorage.setItem(MOCK_SESSION_KEY, '1'),
  logout: () => localStorage.removeItem(MOCK_SESSION_KEY),
}
