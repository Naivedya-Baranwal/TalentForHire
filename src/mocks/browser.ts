import { setupWorker } from 'msw/browser';
import { handlers } from '@/mocks/handlers';

// ✅ Setup the worker with your handlers
export const worker = setupWorker(...handlers);

export const startMockServer = async () => {
  if (process.env.NODE_ENV === 'development') {
    return worker.start({
      onUnhandledRequest: 'warn',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  }
  return Promise.resolve();
};
