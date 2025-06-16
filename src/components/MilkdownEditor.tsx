import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";

import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

const CrepeEditor: React.FC<{content: string}> = ({content}) => {
  const { get } = useEditor((root) => {
    return new Crepe({ root, defaultValue: content });
  }, [content]);

  return <Milkdown />;
};

export const MilkdownEditor: React.FC<{content: string}> = ({content}) => {
  return (
    <MilkdownProvider>
      <CrepeEditor content={content} />
    </MilkdownProvider>
  );
};