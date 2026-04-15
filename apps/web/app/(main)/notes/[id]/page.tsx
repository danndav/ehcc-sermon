import NoteEditor from './note-editor';

export default function NoteEditorPage({ params }: { params: { id: string } }) {
  return <NoteEditor id={params.id} />;
}
