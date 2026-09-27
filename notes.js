export const notesByUser = new Map();

let nextId = 1;

export function getNotes(email) {
  return notesByUser.get(email) ?? [];
}

export function addNote(email, { title, content }) {
  const note = {
    id: nextId++,
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  const existing = notesByUser.get(email) ?? [];
  notesByUser.set(email, [note, ...existing]);
  return note;
}

export function deleteNote(email, id) {
  const existing = notesByUser.get(email) ?? [];
  const filtered = existing.filter((n) => n.id !== Number(id));
  notesByUser.set(email, filtered);
  return filtered;
}