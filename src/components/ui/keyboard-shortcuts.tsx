
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        (s.ctrlKey || false) === (event.ctrlKey || event.metaKey) &&
        (s.altKey || false) === event.altKey &&
        (s.shiftKey || false) === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export const GlobalKeyboardShortcuts = () => {
  const { toast } = useToast();

  const shortcuts: ShortcutConfig[] = [
    {
      key: '?',
      action: () => {
        toast({
          title: 'Keyboard Shortcuts',
          description: 'Ctrl+N: New booking, Ctrl+S: Save, Ctrl+/: Search, ?: Show this help',
        });
      },
      description: 'Show keyboard shortcuts'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  return null;
};
