import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import navigation from '@react-navigation/native';
import { Teaser } from '../Teaser';
import { PostItem } from '../../../services/blog/types';

const mockFirebaseTimestamp = { toDate: () => new Date('2020-01-01') };
jest.mock('@react-navigation/native', () => jest.fn());
// @ts-ignore
navigation.useNavigation = jest.fn(() => ({ navigate: jest.fn() }));

describe('Teaser', () => {
  it('renders correctly', () => {
    const post = {
      id: 'string-id',
      author: 'author',
      author_id: 'author-id',
      body: 'Post Body',
      cover: 'cover-url',
      published: mockFirebaseTimestamp,
      title: 'Post Title',
    };
    const component = renderer.create(<Teaser post={post as PostItem} />);
    expect(component).toMatchSnapshot();
  });
});
