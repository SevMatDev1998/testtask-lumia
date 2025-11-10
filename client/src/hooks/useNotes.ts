import { useState, useEffect } from "react";
import { useLumiaPassportSession } from "@lumiapassport/ui-kit";
import { notesApi, type Note } from "../lib/api";
import { encryptContent, decryptContent } from "../lib/encryption";

export function useNotes() {
  const { session } = useLumiaPassportSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!session?.ownerAddress) return;

    setLoading(true);
    setError(null);
    try {
      const response = await notesApi.getAll();
      const decryptedNotes = await Promise.all(
        response.data.map(async (note) => ({
          ...note,
          content: await decryptContent(note.content, session.ownerAddress),
        }))
      );
      setNotes(decryptedNotes);
    } catch (err) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string) => {
    if (!session?.ownerAddress) return;

    setLoading(true);
    setError(null);
    try {
      const encryptedContent = await encryptContent(
        content,
        session.ownerAddress
      );
      const response = await notesApi.create({
        title,
        content: encryptedContent,
      });
      const decryptedNote = {
        ...response.data,
        content: await decryptContent(
          response.data.content,
          session.ownerAddress
        ),
      };
      setNotes([decryptedNote, ...notes]);
    } catch (err) {
      setError("Failed to create note");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateNote = async (
    id: string,
    title: string,
    content: string
  ) => {
    if (!session?.ownerAddress) return;

    setLoading(true);
    setError(null);
    try {
      const encryptedContent = await encryptContent(
        content,
        session.ownerAddress
      );
      const response = await notesApi.update(id, {
        title,
        content: encryptedContent,
      });
      const decryptedNote = {
        ...response.data,
        content: await decryptContent(
          response.data.content,
          session.ownerAddress
        ),
      };
      setNotes(notes.map((n) => (n.id === id ? decryptedNote : n)));
    } catch (err) {
      setError("Failed to update note");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await notesApi.delete(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err) {
      setError("Failed to delete note");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.ownerAddress) {
      fetchNotes();
    }
  }, [session?.ownerAddress]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes,
  };
}
