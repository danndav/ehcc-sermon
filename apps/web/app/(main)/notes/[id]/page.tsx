import NoteEditor from './note-editor';

const MOCK_NOTE_IDS = ['1', '2', '3', '4', '5', '6', '7'];

export function generateStaticParams() {
  return MOCK_NOTE_IDS.map((id) => ({ id }));
}

export default function NoteEditorPage({ params }: { params: { id: string } }) {
  return <NoteEditor id={params.id} />;
}
