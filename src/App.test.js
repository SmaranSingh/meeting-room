import { ApolloProvider } from '@apollo/client';
import { render, screen } from '@testing-library/react';
import App from './App';

test('tests cta', () => {
  render(
    <ApolloProvider>
      <App />
    </ApolloProvider>
  );
  const cta = screen.getByTestId('add-meeting-btn');
  expect(cta).toBeTruthy();
});
