import { useState } from "react";
import { useLumiaPassportSession } from "@lumiapassport/ui-kit";
import { useAuth } from "../hooks/useAuth";
import { useNotes } from "../hooks/useNotes";
import { NoteCard } from "./NoteCard";
import { NoteForm } from "./NoteForm";

export function NotesList() {
  const { session } = useLumiaPassportSession();
  useAuth();
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
  const [showForm, setShowForm] = useState(false);

  if (!session) {
    return null;
  }

  const handleCreate = async (title: string, content: string) => {
    await createNote(title, content);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
            <p className="text-sm text-gray-600 mt-1">
              {session.ownerAddress.slice(0, 6)}...{session.ownerAddress.slice(-4)}
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              New Note
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Note</h3>
            <NoteForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              submitLabel="Create"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading && notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No notes yet. Create your first note!
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
