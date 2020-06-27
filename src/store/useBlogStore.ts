import React, { useEffect, useRef } from 'react';
import { addPost, subscribeToPosts } from '../services/blog';
import { PostData, PostItem } from '../services/blog/types';

const LOADING = 'LOADING';
const LOADED = 'LOADED';

interface State {
  isLoading: boolean;
  posts: PostItem[] | null;
}

const initialState: State = {
  isLoading: false,
  posts: null,
};

interface LoadingAction {
  type: typeof LOADING;
}

interface LoadedAction {
  type: typeof LOADED;
  posts: PostItem[];
}

type ActionType = LoadingAction | LoadedAction;

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case LOADING:
      return { ...state, isLoading: true };
    case LOADED:
      const { posts } = action;
      if (state.posts) {
        const loaded = posts.map((post) => {
          const existingPost =
            state.posts && state.posts.find((p) => p.id === post.id);
          return existingPost || post;
        });
        return { ...state, isLoading: false, posts: loaded };
      } else {
        return { ...state, isLoading: false, posts };
      }
    default:
      return state;
  }
};

export const useBlogStore = () => {
  const unsubscribe = useRef<() => void>();
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const actions = React.useMemo(
    () => ({
      load: async () => {
        const callback = (posts: PostItem[]) =>
          dispatch({ type: 'LOADED', posts });
        unsubscribe.current && unsubscribe.current();
        unsubscribe.current = await subscribeToPosts(callback);
      },
      add: async (postData: PostData) => {
        await addPost(postData);
      },
    }),
    [],
  );

  useEffect(() => {
    (async () => {
      await actions.load();
      return () => {
        console.log('UNSUBSCRIBING...');
        return unsubscribe.current && unsubscribe.current();
      };
    })();
  }, []);

  return { ...state, ...actions };
};
