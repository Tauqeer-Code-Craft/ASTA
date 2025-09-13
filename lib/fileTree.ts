export interface FileNodeBase {
  name: string;
  path: string; // unique path
}

export interface DirectoryNode extends FileNodeBase {
  type: 'dir';
  children: FileSystemNode[];
}

export interface FileLeaf extends FileNodeBase {
  type: 'file';
  ext?: string;
  language?: string;
  size?: number;
  content?: string; // placeholder future usage
}

export type FileSystemNode = DirectoryNode | FileLeaf;

// Demo tree (replace later with real FS)
export const demoTree: FileSystemNode = {
  type: 'dir',
  name: 'project',
  path: '/',
  children: [
    { type: 'file', name: 'index.tsx', path: '/index.tsx', ext: 'tsx', language: 'tsx' },
    { type: 'file', name: 'App.tsx', path: '/App.tsx', ext: 'tsx', language: 'tsx' },
    {
      type: 'dir',
      name: 'components',
      path: '/components',
      children: [
        { type: 'file', name: 'Button.tsx', path: '/components/Button.tsx', ext: 'tsx', language: 'tsx' },
        { type: 'file', name: 'Card.tsx', path: '/components/Card.tsx', ext: 'tsx', language: 'tsx' },
      ],
    },
    {
      type: 'dir',
      name: 'hooks',
      path: '/hooks',
      children: [
        { type: 'file', name: 'useFeature.ts', path: '/hooks/useFeature.ts', ext: 'ts', language: 'ts' },
      ],
    },
    { type: 'file', name: 'styles.css', path: '/styles.css', ext: 'css', language: 'css' },
    {
      type: 'dir',
      name: 'utils',
      path: '/utils',
      children: [
        { type: 'file', name: 'helpers.ts', path: '/utils/helpers.ts', ext: 'ts', language: 'ts' },
      ],
    },
  ],
};

export function flattenTree(node: FileSystemNode, acc: FileLeaf[] = []): FileLeaf[] {
  if (node.type === 'file') acc.push(node);
  else node.children.forEach(c => flattenTree(c, acc));
  return acc;
}
