import React, { useState } from 'react';
import Textarea from './commons/Textarea';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Écrivez votre contenu en Markdown...",
  error,
  label,
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Fonction simple pour convertir le Markdown en HTML
  const parseMarkdown = (markdown: string): string => {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*__)$/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*)/gim, '<em>$1</em>');

    // Code inline
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg" />');

    // Line breaks
    html = html.replace(/\n\n/gim, '</p><p>');
    html = html.replace(/\n/gim, '<br>');

    // Lists
    html = html.replace(/^\* (.+)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    html = html.replace(/^\d+\. (.+)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

    // Blockquotes
    html = html.replace(/^> (.+)/gim, '<blockquote>$1</blockquote>');

    // Wrap in paragraphs if not already wrapped
    if (!html.startsWith('<')) {
      html = `<p>${html}</p>`;
    }

    return html;
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('.markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Restaurer la sélection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Barre d'outils */}
      <div className="border border-secondary-300 rounded-t-lg bg-secondary-50 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => insertMarkdown('**', '**')}
            className="p-1 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200 rounded"
            title="Gras"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h6a4 4 0 014 4 3.99 3.99 0 01-1.73 3.3A4 4 0 0115 14a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v2h5a2 2 0 100-4H5zm0 4v4h6a2 2 0 100-4H5z"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => insertMarkdown('*', '*')}
            className="p-1 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200 rounded italic"
            title="Italique"
          >
            I
          </button>
          
          <button
            type="button"
            onClick={() => insertMarkdown('`', '`')}
            className="p-1 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200 rounded font-mono text-sm"
            title="Code"
          >
            {'</>'}
          </button>
          
          <button
            type="button"
            onClick={() => insertMarkdown('[', '](url)')}
            className="p-1 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200 rounded"
            title="Lien"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
            </svg>
          </button>
          
          <button
            type="button"
            onClick={() => insertMarkdown('## ', '')}
            className="p-1 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-200 rounded font-bold"
            title="Titre"
          >
            H
          </button>
        </div>

        {/* Onglets */}
        <div className="flex bg-white rounded-md p-1">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === 'edit'
                ? 'bg-primary text-white'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Éditer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === 'preview'
                ? 'bg-primary text-white'
                : 'text-secondary-600 hover:text-secondary-900'
            }`}
          >
            Aperçu
          </button>
        </div>
      </div>

      {/* Contenu */}
      <div className="border-l border-r border-b border-secondary-300 rounded-b-lg bg-white">
        {activeTab === 'edit' ? (
          <Textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={12}
            className="markdown-textarea border-0 rounded-b-lg focus:ring-0 resize-none"
          />
        ) : (
          <div 
            className="markdown-preview p-4 min-h-80 bg-white rounded-b-lg"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(value) || '<p class="text-secondary-500 italic">Rien à prévisualiser...</p>' }}
          />
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default MarkdownEditor;