'use client';
import { requestProvider } from 'webln';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleWebLNLogin = async () => {
    try {
      await requestProvider();
      router.push('/home');
    } catch (e) {
      Notify.failure('Login with webln failed');
      console.error('Login with webln failed', e);
    }
  };

  return (
    <>
      <div className="p-6 max-w-sm w-full bg-gray-800 rounded-lg border border-gray-700 shadow-md">
        <h2 className="mb-6 text-xl sm:text-2xl font-bold text-center text-gray-300">
          Login with a Browser Extension (NIP-07)
        </h2>{' '}
        <button
          onClick={handleWebLNLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Login with WebLN
        </button>
      </div>
    </>
  );
}
