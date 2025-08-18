import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  return (
    <div className={`rich-text-editor ${className || ''}`}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'inherit',
          },
        }}
        height={200}
        data-color-mode="light"
      />
    </div>
  );
};

export default RichTextEditor;