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
      const res = await notesApi.getAll();
      const decrypted = await Promise.all(
        res.data.map(async (note) => ({
          ...note,
          content: await decryptContent(note.content, session.ownerAddress),
        }))
      );
      setNotes(decrypted);
    } catch (e) {
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
      const encrypted = await encryptContent(
        content,
        session.ownerAddress
      );
      const res = await notesApi.create({
        title,
        content: encrypted,
      });
      const decrypted = {
        ...res.data,
        content: await decryptContent(
          res.data.content,
          session.ownerAddress
        ),
      };
      setNotes([decrypted, ...notes]);
    } catch (e) {
      setError("Failed to create note");
      throw e;
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
      const encrypted = await encryptContent(
        content,
        session.ownerAddress
      );
      const res = await notesApi.update(id, {
        title,
        content: encrypted,
      });
      const decrypted = {
        ...res.data,
        content: await decryptContent(
          res.data.content,
          session.ownerAddress
        ),
      };
      setNotes(notes.map((n) => (n.id === id ? decrypted : n)));
    } catch (e) {
      setError("Failed to update note");
      throw e;
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
    } catch (e) {
      setError("Failed to delete note");
      throw e;
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
