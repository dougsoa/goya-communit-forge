import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Link, 
  Image, 
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const [selectedText, setSelectedText] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + 
      textToInsert + 
      after + 
      value.substring(end);
    
    onChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleBold = () => insertText("**", "**", "bold text");
  const handleItalic = () => insertText("*", "*", "italic text");
  const handleHeading = () => insertText("## ", "", "heading");
  const handleList = () => insertText("- ", "", "list item");
  const handleOrderedList = () => insertText("1. ", "", "list item");

  const handleLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    
    if (selected) {
      setSelectedText(selected);
      setShowLinkDialog(true);
    } else {
      insertText("[link text](", ")", "");
    }
  };

  const insertLink = () => {
    if (linkUrl && selectedText) {
      const linkMarkdown = `[${selectedText}](${linkUrl})`;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = 
        value.substring(0, start) + 
        linkMarkdown + 
        value.substring(end);
      
      onChange(newValue);
    }
    setShowLinkDialog(false);
    setLinkUrl("");
    setSelectedText("");
  };

  const handleImage = () => {
    setShowImageDialog(true);
  };

  const insertImage = () => {
    if (imageUrl) {
      insertText(`![image](${imageUrl})`);
    }
    setShowImageDialog(false);
    setImageUrl("");
  };

  const toolbarButtons = [
    { icon: Bold, action: handleBold, tooltip: "Bold" },
    { icon: Italic, action: handleItalic, tooltip: "Italic" },
    { icon: Type, action: handleHeading, tooltip: "Heading" },
    { icon: List, action: handleList, tooltip: "Bullet List" },
    { icon: ListOrdered, action: handleOrderedList, tooltip: "Numbered List" },
    { icon: Link, action: handleLink, tooltip: "Link" },
    { icon: Image, action: handleImage, tooltip: "Image" },
  ];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md border">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.action}
            className="h-8 w-8 p-0"
            title={button.tooltip}
            type="button"
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={className}
      />

      {/* Link Dialog */}
      <Popover open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-medium">Add Link</h4>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Text: {selectedText}</p>
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && insertLink()}
              />
              <div className="flex gap-2">
                <Button onClick={insertLink} size="sm" disabled={!linkUrl}>
                  Add Link
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Image Dialog */}
      <Popover open={showImageDialog} onOpenChange={setShowImageDialog}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-medium">Add Image</h4>
            <div className="space-y-2">
              <Input
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && insertImage()}
              />
              <div className="flex gap-2">
                <Button onClick={insertImage} size="sm" disabled={!imageUrl}>
                  Add Image
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowImageDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Preview area (optional) */}
      {value && (
        <div className="p-3 bg-muted/50 rounded-md border">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className="prose prose-sm max-w-none">
            {value.split('\n').map((line, index) => (
              <p key={index} className="text-sm">
                {line || <br />}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;