import { nanoid } from 'nanoid';
import notes from './notes.js';

export const addNoteHandler = (request, h) => {
  const timestamp = new Date().toISOString();
  const newNote = {
    id: nanoid(16),
    title: request.payload.title,
    tags: request.payload.tags,
    body: request.payload.body,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  notes.push(newNote);

  const isSuccess = notes.filter((item) => item.id === newNote.id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: newNote.id
      }
    });
    response.code(201);
    return response;
  }
};

export const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes
  }
});

export const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((item) => item.id === id);
  if (note) {
    return {
      status: 'success',
      data: {
        note
      }
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan'
  });
  response.code(404);
  return response;
};

export const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const timestamp = new Date().toISOString();
  const { title, tags, body } = request.payload;
  const index = notes.findIndex((item) => item.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      messages: 'Gagal memperbarui catatan. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt: timestamp
  };

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil diperbarui'
  });

  response.code(200);
  return response;

};

export const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((item) => item.id === id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      messages: 'Gagal menghapus catatan. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  notes.splice(index, 1);
  const response = h.response({
    status: 'success',
    messages: 'Catatan berhasil dihapus'
  });
  response.code(200);
  return response;
};