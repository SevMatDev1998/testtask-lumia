import { useState } from "react";
import { useLumiaPassportSession, ConnectWalletButton } from "@lumiapassport/ui-kit";
import { NotesList } from "./components/NotesList";
import { BountyBoard } from "./components/BountyBoard";
import "./App.css";

function App() {
  const { session } = useLumiaPassportSession();
  const [activeTab, setActiveTab] = useState<"notes" | "bounty">("notes");

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Web3 DApp
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Secure encrypted notes & bounty board
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
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Web3 DApp</h1>
            <ConnectWalletButton label="Wallet" mode="compact" />
          </div>
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === "notes"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab("bounty")}
              className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                activeTab === "bounty"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Bounty Board
            </button>
          </nav>
        </div>
      </header>
      <main>
        {activeTab === "notes" ? <NotesList /> : <BountyBoard />}
      </main>
    </div>
  );
}

export default App;
