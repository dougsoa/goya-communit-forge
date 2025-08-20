import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`min-h-[200px] text-foreground resize-none border-none bg-transparent p-0 focus-visible:ring-0 ${className || ''}`}
      style={{
        fontSize: 16,
        lineHeight: 1.6,
        fontFamily: 'inherit',
        color: 'hsl(var(--foreground))',
      }}
    />
  );
};

export default RichTextEditor;