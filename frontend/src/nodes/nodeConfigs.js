// nodeConfigs.js
//
// Every node in the palette is declared here as plain data: a title, an
// icon, a category (which drives the accent color), the handles it
// exposes, and the fields in its body. createNodeComponent() (in
// createNodeComponent.js) turns one of these objects into a real React
// Flow node component. This file has zero JSX — that's the point. Adding
// node #10 means adding an entry here, not writing a new component.

import {
  LogIn,
  LogOut,
  Sparkles,
  Type,
  Filter,
  GitMerge,
  Timer,
  Code2,
  Globe,
} from 'lucide-react';

export const nodeConfigs = {
  // ---- Original four, reimplemented as config ----

  customInput: {
    title: 'Input',
    icon: LogIn,
    category: 'io',
    handles: [{ id: 'value', type: 'source', position: 'right' }],
    fields: [
      { type: 'text', name: 'inputName', label: 'Name', default: '' },
      {
        type: 'select',
        name: 'inputType',
        label: 'Type',
        default: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
      },
    ],
  },

  customOutput: {
    title: 'Output',
    icon: LogOut,
    category: 'io',
    handles: [{ id: 'value', type: 'target', position: 'left' }],
    fields: [
      { type: 'text', name: 'outputName', label: 'Name', default: '' },
      {
        type: 'select',
        name: 'outputType',
        label: 'Type',
        default: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
        ],
      },
    ],
  },

  llm: {
    title: 'LLM',
    icon: Sparkles,
    category: 'model',
    handles: [
      { id: 'system', type: 'target', position: 'left', label: 'system' },
      { id: 'prompt', type: 'target', position: 'left', label: 'prompt' },
      { id: 'response', type: 'source', position: 'right' },
    ],
    fields: [
      {
        type: 'select',
        name: 'model',
        label: 'Model',
        default: 'gpt-4o',
        options: [
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
          { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
        ],
      },
      { type: 'slider', name: 'temperature', label: 'Temperature', default: 0.7, min: 0, max: 1.5, step: 0.1 },
      { type: 'note', text: 'Combines a system and prompt input into one response.' },
    ],
  },

  // text node is hand-built (see textNode.js) because of its variable
  // parsing + auto-resize logic from Part 3, but it still renders through
  // BaseNode using a config of its own — see textNode.js.

  // ---- Five new nodes, demonstrating the abstraction ----

  filter: {
    title: 'Filter',
    icon: Filter,
    category: 'data',
    handles: [
      { id: 'input', type: 'target', position: 'left' },
      { id: 'output', type: 'source', position: 'right' },
    ],
    fields: [
      {
        type: 'select',
        name: 'condition',
        label: 'Keep where',
        default: 'contains',
        options: [
          { value: 'contains', label: 'contains' },
          { value: 'equals', label: 'equals' },
          { value: 'starts_with', label: 'starts with' },
          { value: 'not_empty', label: 'is not empty' },
        ],
      },
      { type: 'text', name: 'matchValue', label: 'Value', placeholder: 'e.g. "approved"' },
    ],
  },

  merge: {
    title: 'Merge',
    icon: GitMerge,
    category: 'data',
    handles: [
      { id: 'a', type: 'target', position: 'left', label: 'a' },
      { id: 'b', type: 'target', position: 'left', label: 'b' },
      { id: 'output', type: 'source', position: 'right' },
    ],
    fields: [
      {
        type: 'select',
        name: 'strategy',
        label: 'Strategy',
        default: 'concat',
        options: [
          { value: 'concat', label: 'Concatenate' },
          { value: 'prefer_a', label: 'Prefer A' },
          { value: 'prefer_b', label: 'Prefer B' },
        ],
      },
    ],
  },

  delay: {
    title: 'Delay',
    icon: Timer,
    category: 'logic',
    handles: [
      { id: 'input', type: 'target', position: 'left' },
      { id: 'output', type: 'source', position: 'right' },
    ],
    fields: [
      { type: 'number', name: 'seconds', label: 'Wait (seconds)', default: 1, min: 0, max: 600 },
    ],
  },

  code: {
    title: 'Code',
    icon: Code2,
    category: 'logic',
    handles: [
      { id: 'input', type: 'target', position: 'left' },
      { id: 'output', type: 'source', position: 'right' },
    ],
    fields: [
      {
        type: 'select',
        name: 'language',
        label: 'Language',
        default: 'javascript',
        options: [
          { value: 'javascript', label: 'JavaScript' },
          { value: 'python', label: 'Python' },
        ],
      },
      { type: 'textarea', name: 'snippet', label: 'Snippet', placeholder: 'return input.toUpperCase();' },
    ],
  },

  apiRequest: {
    title: 'API Request',
    icon: Globe,
    category: 'io',
    handles: [
      { id: 'input', type: 'target', position: 'left' },
      { id: 'response', type: 'source', position: 'right' },
    ],
    fields: [
      {
        type: 'select',
        name: 'method',
        label: 'Method',
        default: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
        ],
      },
      { type: 'text', name: 'url', label: 'URL', placeholder: 'https://api.example.com/...' },
    ],
  },
};

// Re-exported so the palette/toolbar can list everything without a second
// hardcoded array.
export const textNodeConfig = {
  title: 'Text',
  icon: Type,
  category: 'text',
};
