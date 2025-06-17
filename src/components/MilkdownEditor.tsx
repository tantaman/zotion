import {Crepe} from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import {collab, collabServiceCtx} from '@milkdown/plugin-collab';
import {Milkdown, MilkdownProvider, useEditor} from '@milkdown/react';
import {useQuery} from '@rocicorp/zero/react';
import {WebsocketProvider} from 'y-websocket';
import {Doc} from 'yjs';
import {docBody} from '../../zero/queries';
import {DocId, User} from '../../zero/schema';
import {getEnv} from '../meta-env';

const usercolors = [
  '#30bced',
  '#6eeb83',
  '#ffbc42',
  '#ecd444',
  '#ee6352',
  '#9ac2c9',
  '#8acb88',
  '#1be7ff',
];
const myColor = usercolors[Math.floor(Math.random() * usercolors.length)];

const CrepeEditor: React.FC<{
  docId: DocId;
  initialValue: string;
  user: User;
}> = ({docId, initialValue, user}) => {
  const {get} = useEditor(
    root => {
      const ret = new Crepe({root});
      ret.editor.use(collab);
      const doc = new Doc();
      const wsProvider = new WebsocketProvider(
        getEnv('VITE_PUBLIC_Y_SERVER'),
        docId,
        doc,
      );

      ret.editor.create().then(() => {
        ret.editor.action(ctx => {
          const collabService = ctx.get(collabServiceCtx);

          const awareness = wsProvider.awareness;
          awareness.setLocalStateField('user', {
            name: (user.emoji ?? '') + user.name,
            color: myColor,
          });
          collabService.bindDoc(doc).setAwareness(awareness).connect();

          wsProvider.once('sync', async isSynced => {
            if (isSynced) {
              collabService.applyTemplate(initialValue).connect();
            }
          });
        });
      });

      return ret;
    },
    [docId],
  );

  return <Milkdown />;
};

export const MilkdownEditor: React.FC<{docId: DocId; user: User}> = ({
  docId,
  user,
}) => {
  /*
  - doc id
  - load body
  - when body loaded, show editor
  - can preload docs on hover too
  */
  const [body] = useQuery(docBody(docId));
  if (!body) {
    return null;
  }
  return (
    <MilkdownProvider>
      <CrepeEditor docId={docId} initialValue={body.content} user={user} />
    </MilkdownProvider>
  );
};
