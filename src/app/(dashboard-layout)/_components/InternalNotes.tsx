'use client';

import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import { MultiLine } from '@/components/input';

interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface InternalNotesProps {
  initialNotes?: Note[];
}

export default function InternalNotes({ initialNotes }: InternalNotesProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes || []);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      author: 'Admin User',
      content: newNote,
      timestamp: 'Just now',
    };
    setNotes([note, ...notes]);
    setNewNote('');
  };

  return (
    <div className='bg-white p-8 rounded-2xl border border-navy/5 shadow-sm h-full flex flex-col'>
      <h3 className='text-xl font-playfair font-bold text-navy mb-6'>
        Internal Notes
      </h3>

      <div className='flex-1 space-y-6 overflow-y-auto pr-2 mb-6 max-h-[400px]'>
        {notes.length === 0 && (
          <p className='text-sm text-settley-text italic'>
            No internal notes yet.
          </p>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className='flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100'
          >
            <FaUserCircle className='text-3xl text-navy/20 flex-shrink-0' />
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-bold text-navy'>
                  {note.author}
                </span>
                <span className='text-[10px] text-medium-grey uppercase font-bold tracking-widest'>
                  {note.timestamp}
                </span>
              </div>
              <p className='text-sm text-settley-text leading-relaxed'>
                {note.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className='border-t border-slate-100 pt-6 space-y-4'>
        <MultiLine
          id='internal-note-input'
          label='Add Internal Note'
          placeholder='Type your note here...'
          value={newNote}
          onChange={(e) => setNewNote((e.target as HTMLTextAreaElement).value)}
          className='min-h-[100px] border-slate-200'
        />
        <button
          className='w-full py-3 rounded-xl font-bold bg-navy text-white disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={handleAddNote}
          disabled={!newNote.trim()}
        >
          Post Note
        </button>
      </div>
    </div>
  );
}
