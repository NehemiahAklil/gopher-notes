import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

type NotesProps = {
  topic: string;
  category: string;
};

const ConfirmationModal = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Delete Note
          </h3>
          <button
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
          >
            <X size={20} />
          </button>
        </div>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          Are you sure you want to delete this note? This action cannot be
          undone.
        </p>
        <div className='flex justify-end gap-3'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Notes = ({ topic, category }: NotesProps) => {
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasNote, setHasNote] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const noteKey = `note-${category}-${topic}`;

  // Load saved note on component mount or when noteKey changes
  useEffect(() => {
    const savedNote = localStorage.getItem(noteKey);
    if (savedNote) {
      setNote(savedNote);
      setHasNote(true);
    } else {
      setHasNote(false);
    }
  }, [noteKey]);

  const saveNote = useCallback(() => {
    try {
      localStorage.setItem(noteKey, note);
      setHasNote(true);
      setIsEditing(false);
      toast.success('Note saved successfully!');
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note. Please try again.');
    }
  }, [note, noteKey]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const deleteNote = useCallback(() => {
    try {
      localStorage.removeItem(noteKey);
      setNote('');
      setHasNote(false);
      setIsEditing(false);
      setShowDeleteModal(false);
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note. Please try again.');
    }
  }, [noteKey]);

  const confirmDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      saveNote();
    }
  };

  if (!hasNote && !isEditing) {
    return (
      <div className='mt-10 p-4 border border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
            My Notes
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className='flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors'
          >
            <Plus size={16} />
            New Note
          </button>
        </div>
        <p className='text-gray-500 dark:text-gray-400'>
          No notes yet. Click "New Note" to add one.
        </p>
      </div>
    );
  }

  return (
    <div className='mt-10'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
          My Notes
        </h2>
        <div className='flex gap-2'>
          {isEditing ? (
            <div className='flex justify-end gap-2'>
              <button
                onClick={saveNote}
                disabled={!note.trim()}
                className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                Save Note
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={startEditing}
                className='p-1.5 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors'
                title='Edit note'
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={confirmDelete}
                className='p-1.5 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition-colors'
                title='Delete note'
              >
                <Trash size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className='space-y-4'>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Write your notes here...'
            className='w-full min-h-[150px] p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ring-blue-300'
            autoFocus
          />
        </div>
      ) : (
        <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
          <pre className='whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200'>
            {note}
          </pre>
        </div>
      )}

      {showDeleteModal && (
        <ConfirmationModal
          onConfirm={deleteNote}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default Notes;
