import { useLumiaPassportSession, ConnectWalletButton } from "@lumiapassport/ui-kit";
import { NotesList } from "./components/NotesList";
import "./App.css";

function App() {
  const { session } = useLumiaPassportSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Notes DApp
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Secure encrypted notes on blockchain
          </p>
          <div className="flex justify-center">
            <ConnectWalletButton label="Connect Wallet" mode="compact" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Notes DApp</h1>
          <ConnectWalletButton label="Wallet" mode="compact" />
        </div>
      </header>
      <main>
        <NotesList />
      </main>
    </div>
  );
}

export default App;
