import React from "react";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  error,
  label,
}) => {
  return (
    <div className="w-full space-y-2" data-color-mode="light">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        className="border rounded-lg"
      />
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default MarkdownEditor;