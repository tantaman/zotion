import {Crepe} from '@milkdown/crepe';
import {Milkdown, MilkdownProvider, useEditor} from '@milkdown/react';

import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';

const CrepeEditor: React.FC<{
  content: string;
  onMarkdown: (md: string) => void;
}> = ({content, onMarkdown}) => {
  const {get} = useEditor(
    root => {
      const ret = new Crepe({root, defaultValue: content});
      ret.on(listener => {
        // TODO: update to surgical update events instead.
        listener.markdownUpdated((_ctx, md) => onMarkdown(md));
      });
      return ret;
    },
    [content],
  );

  return <Milkdown />;
};

export const MilkdownEditor: React.FC<{
  content: string;
  handleContentChange: (content: string) => void;
}> = ({content, handleContentChange}) => {
  return (
    <MilkdownProvider>
      <CrepeEditor content={content} onMarkdown={handleContentChange} />
    </MilkdownProvider>
  );
};
